import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {BusStopPage} from '../bus-stop/bus-stop';
import {} from '@types/googlemaps'; //This import is necessary otherwise angular complains about namespaces
import {BusPage} from '../bus/bus';
import {ServerProvider} from '../../providers/server-provider';
import {BusRoute, BusRouteProvider, Section} from '../../providers/bus-route/bus-route';


/**
 * The main page of the app. Communicates with the server and google maps to display a custom google map to the user.
 * The map displays the user's position, if available to the app, else it centers the map around the default position of the Bath bus station.
 * It displays all routes by default. (Future allow users to filter bus routes).
 * It displays all Bus stops attached to all routes currently displayed.
 * It displays all buses of the displayed routes as they travel along the routes.
 */
declare var google;



@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [ServerProvider]
})

export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  //in case server fails stuff gets put into the errorMessage - isn't used for anything currently
  public errorMessage;
  //maps bus stop IDs to their markers to allow markers to be manipulated later
  private busStopMarkers: Map<number, google.maps.Marker>;
  //maps busroute segements to strings to allow them to be hidden/revealed later
  private busRouteLines: Map<string, google.maps.Polyline>;
  //collection of bus markers to empty whenever server is called
  private busMarkers: Map<number, google.maps.Marker>;
  //colors for the bus routes
  private colors = ['#bb72e0', '#90b2ed', '#049310', '#f93616', '#ffc36b', '#f7946a', '#ef60ff'];
  //kept to allow the page to unsubscribe from subscriptions when it's destroyed
  private busSubscription;
  private stopsSubscription;

  /**
   * imports all the necessary parameters
   * @param {NavController} navCtrl - for navigation
   * @param {NavParams} navParams - to pass parameters around the navcontroller
   * @param {ModalController} modalctrl - to handle modals
   * @param {ServerProvider} serverService - for communicating with the server
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalctrl: ModalController, public serverService: ServerProvider, private busRouteProvider: BusRouteProvider) {
    this.busStopMarkers = new Map<number, google.maps.Marker>();
    this.busRouteLines = new Map<string, google.maps.Polyline>();
    this.busMarkers = new Map<number, google.maps.Marker>();
  }

  //Unsubscribe from the server's updates when the page is closed
  ngOnDestroy() {
    this.busSubscription.unsubscribe();
    this.stopsSubscription.unsubscribe();
  }

  //Functions which run when the page is opened
  ionViewDidLoad() {
    this.loadMap()
      .then((latLng) => {
        if (latLng != null) this.addUserPositionMarker(latLng);
        this.addBusStops();
        this.addBusRoutes();
        this.addBuses();
      });
  }

  /*
   * Gets the user's position and calls createmap with it. If user's position request is denied creates map with bath spa station as the center
   * @return - a promise saying that the map was created successfully
   */
  private loadMap(): Promise<object> {
    let geo = navigator.geolocation;
    return new Promise<object>(resolve => {
      geo.getCurrentPosition((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.createMap(latLng);
        resolve(latLng);
      }, () => {
        let latLng = new google.maps.LatLng(51.377981, -2.359026);
        this.createMap(latLng);
        console.log('Permission denied');
        resolve(null);
      });
    });
  }

  //Creates the initial map centered around latLng
  private createMap(latLng: Object) {
    const mapOptions = {
      center: latLng,
      zoom: 15,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [{
        featureType: 'transit.station.bus',
        elementType: 'all',
        stylers: [{
          visibility: 'off'
        }]
      }]
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  //Adds the user's position to the map if available to the app, and sets it to update automatically
  private addUserPositionMarker(latLng) {
    let userPosition = new google.maps.Marker({
      map: this.map,
      position: latLng,
      title: 'Your Position',
      icon: {
        scale: 5,
        path: google.maps.SymbolPath.CIRCLE
      }
    });

    navigator.geolocation.watchPosition((position) => {
      userPosition.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    });
  }

  //gets the bus stops from the server and adds them to the map - they are set to update automatically.
  private addBusStops() {
    let busStops: any = [];

    this.serverService.getBusStopLocations().then(data => {
      busStops = data;
      busStops = busStops.data;
      for (let i = 0; i < busStops.length; i++) {
        this.addBusStop(busStops[i]);
      }
    }, rejected => {
      console.log(rejected);
      this.addBusStops();
    });
  }

  //adds a single bus stop to the map with a click event that opens the relevant busstoppage
  private addBusStop(busStop) {
    let stopMarker = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(busStop.location.latitude, busStop.location.longitude),
      title: busStop.busStopName,
      icon: {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 3
      }
    });

    this.busStopMarkers.set(busStop.busStopId, stopMarker);
    google.maps.event.addListener(stopMarker, 'click', () => this.openBusStopPage(busStop.busStopId, busStop.busStopName));
  }

  //Opens a bus stop page with the details of the bus stop
  private openBusStopPage(busStopId, busStopName) {
    let tryModal = this.modalctrl.create(BusStopPage, {stopId: busStopId, stopName: busStopName});
    tryModal.present();
  }

  //Adds the bus routes from the default routes (Future: Communicate with server to obtain the routes)
  private async addBusRoutes(routesToShow: string[] = ["U1"]): Promise<void> {
    const roundaboutCoords = [
      {lat: 51.377484, lng:  -2.361208},
      {lat: 51.377484, lng:  -2.361208},
      {lat: 51.377385, lng:  -2.360370},
      {lat: 51.377337, lng:  -2.359838},
      {lat: 51.377314, lng:  -2.359773},
      {lat: 51.377296, lng:  -2.359740},
      {lat: 51.377169, lng:  -2.359606},
      {lat: 51.377153, lng:  -2.359604},
      {lat: 51.377118, lng:  -2.359625},
      {lat: 51.377085, lng:  -2.359652},
      {lat: 51.377043, lng:  -2.359702},
      {lat: 51.377004, lng:  -2.359801},
      {lat: 51.377161, lng:  -2.361322},
      {lat: 51.377194, lng:  -2.361415},
      {lat: 51.377233, lng:  -2.361461},
      {lat: 51.377278, lng:  -2.361488},
      {lat: 51.377328, lng:  -2.361506},
      {lat: 51.377371, lng:  -2.361495},
      {lat: 51.377413, lng:  -2.361458},
      {lat: 51.377434, lng:  -2.361423},
      {lat: 51.377454, lng:  -2.361383},
      {lat: 51.377480, lng:  -2.361299},
      {lat: 51.377483, lng:  -2.361218},
      {lat: 51.377484, lng:  -2.361208}
    ];
    let routes: BusRoute[];
    let sections: Section[];
    try {
      routes = await this.busRouteProvider.getBusRoutes();
      sections = await this.busRouteProvider.getSections();
    } catch(e) {
      console.log('Cannot get routes data.');
      return;
    }

    function getSectionFromId(id: number) {
      return sections.find(s => s.sectionId === id);
    }

    function getAllUsedSections() {
      let allSections = [];
      routes
        .filter(({busRouteName}) => routesToShow.indexOf(busRouteName) !== -1)
        .forEach(({sectionsUsed}) => sectionsUsed.forEach(s => allSections.push(s)));

      // Convert to a set then back to an array to remove duplicates
      return Array.from(new Set(allSections));
    }

    //routes.forEach(({busRouteName, sectionsUsed}) => {
    //  sectionsUsed.forEach(sectionId => {
      getAllUsedSections().forEach(sectionId => {
        const section = getSectionFromId(sectionId);
        const googleMapStyle = section.positions.map(({latitude:lat, longitude:lng}) => ({lat, lng}));
        const busRoute = new google.maps.Polyline({
          path: googleMapStyle,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 0.2,
          strokeWeight: 6,
          map: this.map
        });
        this.busRouteLines.set('', busRoute);
      });
    //});

    const roundabout = new google.maps.Polygon({
      paths: roundaboutCoords,
      strokeColor: '#505050',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#505050',
      fillOpacity: 0
    });
    roundabout.setMap(this.map);
  }

  //Gets the buses from the server, adds the to the map - set to update automatically
  private addBuses() {
    setInterval(() => {
      this.serverService.getBusLocations().then((buses) => {
        for (let i = 0; i < buses.length; i++) {
          this.addBus(buses[i]);
        }
      }, rejected => {
        console.log(rejected);
      });
    }, 1000);
  }

  //Adds a bus marker to the map with a click event
  private addBus(bus) {
    if (this.busMarkers.get(bus.busId)) {
      const marker = this.busMarkers.get(bus.busId);
      this.animateMovement(marker, bus.location);
      //this.busMarkers.get(bus.busId).setPosition(new google.maps.LatLng(bus.location.latitude, bus.location.longitude));
    } else {
      let busMarker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(bus.location.latitude, bus.location.longitude),
        title: bus.routeName
      });
      this.busMarkers.set(bus.busId, busMarker);
      google.maps.event.addListener(busMarker, 'click', () => this.openBusPage(bus.busId, bus.routeName));
    }
  }

  //Animates the movement of a marker to a new longitude/latitude
  private async animateMovement(marker: google.maps.Marker, location: {latitude: number, longitude: number}) {
    function sleep(millis: number): Promise<void> {
      return new Promise(resolve => {
        setTimeout(() => resolve(), millis);
      });
    }
    function ease(x: number): number {
      return ((Math.sin((x-0.5)*Math.PI))+1)/2;
    }

    const timeToAnimate = 90;
    const fps = 60;
    const totalFrames = timeToAnimate * fps / 1000;

    const oldLat = marker.getPosition().lat();
    const newLat = location.latitude;
    const oldLon = marker.getPosition().lng();
    const newLon = location.longitude;
    const latDif = newLat - oldLat;
    const lonDif = newLon - oldLon;

    for (let i = 1; i <= totalFrames; i++) {
      const proportion = ease(i / totalFrames);
      const lat = oldLat + (proportion * latDif);
      const lng = oldLon + (proportion * lonDif);
      await sleep(1000/fps);
      marker.setPosition({lat, lng});
    }
  }

  //Opens the bus page with the bus info of the bus given.
  private openBusPage(busId, route) {
    let tryModal = this.modalctrl.create(BusPage, {busId: busId, routeName: route});
    tryModal.present();
  }
}
