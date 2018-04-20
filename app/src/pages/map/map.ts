import {Component, ElementRef, ViewChild} from '@angular/core';
import {Events, IonicPage, Loading, LoadingController, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {BusStopPage} from '../bus-stop/bus-stop';
import {BusPage} from '../bus/bus';
import {BusRoute, BusRouteProvider, Section} from '../../providers/bus-route/bus-route';
import {MapOptionsPopoverPage} from '../map-options-popover/map-options-popover';
import {} from 'googlemaps';
import {} from 'google';
import {SettingsProvider} from '../../providers/settings/settings';
import {Bus, BusProvider} from '../../providers/bus/bus';
import {BusStop, BusStopProvider} from '../../providers/bus-stop/bus-stop';
import {Geolocation} from '@ionic-native/geolocation';


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
  templateUrl: 'map.html'
})

export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  private loadingSpinner: Loading;
  private busIntervals: Map<number, any>;
  private buses: Bus[];
  private busStops: BusStop[];
  public routeStates: { busRouteName: string, active: boolean }[];
  private currentIcons: {busIcon, busStopIcon};
  private userPosition;

  private busStopMarkers: Map<number, google.maps.Marker>;
  private busRouteSectionLines: Map<number, google.maps.Polyline>;
  private busMarkers: Map<number, google.maps.Marker>;
  private colors = ['#bb72e0', '#90b2ed', '#049310', '#f93616', '#ffc36b', '#f7946a', '#ef60ff'];
  private busUrl = './assets/icon/bus.png';
  private revBusUrl = './assets/icon/reversedBus.png';
  private busStopUrl = './assets/icon/busStop.png';
  private busIcons: Array<object> = [{url: this.busUrl,
    scaledSize: new google.maps.Size(64,64),
    anchor: new google.maps.Point(32,50)}, {url: this.busUrl,
    scaledSize: new google.maps.Size(48,48),
    anchor: new google.maps.Point(24,34)}, {url: this.busUrl,
    scaledSize: new google.maps.Size(30,30),
    anchor: new google.maps.Point(15,20)},{url: this.revBusUrl,
    scaledSize: new google.maps.Size(64,64),
    anchor: new google.maps.Point(32,50)}, {url: this.revBusUrl,
    scaledSize: new google.maps.Size(48,48),
    anchor: new google.maps.Point(24,34)}, {url: this.revBusUrl,
    scaledSize: new google.maps.Size(30,30),
    anchor: new google.maps.Point(15,20)}];
  private zoom = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private popoverCtrl: PopoverController,
              private settings: SettingsProvider,
              private events: Events,
              private busRouteProvider: BusRouteProvider,
              private busProvider: BusProvider,
              private busStopProvider: BusStopProvider,
              private geolocation: Geolocation
  ) {
    this.loadingSpinner = this.loadingCtrl.create({
      content: 'Loading map...'
    });
    this.busIntervals = new Map<number, any>();
    this.busStopMarkers = new Map<number, google.maps.Marker>();
    this.busRouteSectionLines = new Map<number, google.maps.Polyline>();
    this.busMarkers = new Map<number, google.maps.Marker>();
  }

  //Unsubscribe from the server's updates when the page is closed
  ngOnDestroy() {
    console.log('being destroyed!');
    this.events.unsubscribe('buses:added');
    this.events.unsubscribe('BusProvider:newBuses')
  }

  //Functions which run when the page is opened
  ionViewDidLoad() {
    this.startShitUp();
  }

  private async startShitUp() {
    try {
      await this.loadingSpinner.present();
      await this.loadMap();
      await this.loadingSpinner.dismissAll();
      await this.setupMapElements();
      const latLng = await this.getUserPosition();
      this.addUserPositionMarker(latLng);
      this.map.setCenter(latLng);
    } catch(e) {

    }
  }

  private updateMapCentre({latitude, longitude}) {
    this.map.setCenter(new google.maps.LatLng(latitude, longitude));
  }

  private async getUserPosition(): Promise<google.maps.LatLng> {
    try {
      const geoPosition = await this.geolocation.getCurrentPosition();
      const {latitude, longitude} = geoPosition.coords;
      this.userPosition = geoPosition.coords;
      return new google.maps.LatLng(latitude, longitude);
    } catch(e) {
      console.log('cannot get user position :(');
    }
  }

  private loadMap(): Promise<void> {
    const latLng = new google.maps.LatLng(51.377981, -2.359026);
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
    return new Promise<void>(resolve => {
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        resolve();
      })
    });
  }

  //Adds the user's position to the map if available to the app, and sets it to update automatically
  private addUserPositionMarker(latLng: google.maps.LatLng): void {
    let userPosition = new google.maps.Marker({
      map: this.map,
      position: latLng,
      title: 'Your Position',
      icon: {
        url: './assets/icon/userIcon.png',
        anchor: new google.maps.Point(16,16),
        scaledSize: new google.maps.Size(32,32)
      }
    });

    navigator.geolocation.watchPosition((position) => {
      userPosition.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    });
  }

  private async presentOptionsPopover(event: UIEvent): Promise<void> {
    if (!this.routeStates) {
      let busRoutes;
      try {
        busRoutes = await this.busRouteProvider.getBusRoutes();
      } catch (err) {
        console.log("Can't get bus routes", err);
        return
      }
      const busRouteNames = busRoutes.map(({busRouteName}) => busRouteName);
      this.routeStates = busRouteNames.map(busRouteName => ({busRouteName, active: true}));
    }
    const popover = this.popoverCtrl.create(MapOptionsPopoverPage, {
      mapPage: this
    });
    await popover.present({
      ev: event
    });
  }

  private async setupMapElements(): Promise<void> {
    const sleep: (number) => Promise<void> = (millis: number) => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, millis);
      });
    };

    try {
      const busRoutes = await this.busRouteProvider.getBusRoutes();
      this.routeStates = busRoutes.map(({busRouteName}) => ({busRouteName, active: true}));

      await this.setupMapRoutes();
      this.setupMapBuses();
      await this.setupMapBusStops();
    } catch(e) {
      await sleep(1000);
      await this.setupMapElements();
    } finally {
      this.map.addListener('zoom_changed', () => {
        if ((this.map.zoom) >= 15){
          this.zoom = 0;
          this.busMarkers.forEach(marker => {
            marker.setIcon(this.busIcons[0]);
          });
          this.busStopMarkers.forEach(marker =>{
            marker.setIcon({url: this.busStopUrl,
              scaledSize: new google.maps.Size(42, 42)})
          });
        } else if (12 < (this.map.zoom) && (this.map.zoom) < 15){
          this.zoom = 1;
          this.busMarkers.forEach(marker =>{
            marker.setIcon(this.busIcons[1])
          });
          this.busStopMarkers.forEach(marker =>{
            marker.setIcon({url: this.busStopUrl,
              scaledSize: new google.maps.Size(30, 30)})
          });
        } else {
          this.zoom = 2;
          this.busMarkers.forEach(marker =>{
            marker.setIcon(this.busIcons[2])
          });
          this.busStopMarkers.forEach(marker =>{
            marker.setIcon({url: this.busStopUrl,
              scaledSize: new google.maps.Size(15, 15)})
          });
        }
      });
    }
  }

  private getCurrentIcons(): {busIcon, busStopIcon} {
    const values: {minValue: number, busIcon, busStopIcon}[] = [
      {
        minValue: 15,
        busIcon: {
          url: this.busUrl,
          scaledSize: new google.maps.Size(64,64),
          anchor: new google.maps.Point(32,50)
        },
        busStopIcon: {
          url: this.busStopUrl,
          scaledSize: new google.maps.Size(42, 42)
        }
      },
      {
        minValue: 12,
        busIcon: {
          url: this.busUrl,
          scaledSize: new google.maps.Size(48,48),
          anchor: new google.maps.Point(24,34)
        },
        busStopIcon: {
          url: this.busStopUrl,
          scaledSize: new google.maps.Size(30, 30)
        }
      },
      {
        minValue: -Infinity,
        busIcon: {
          url: this.busUrl,
          scaledSize: new google.maps.Size(30,30),
          anchor: new google.maps.Point(15,20)
        },
        busStopIcon: {
          url: this.busStopUrl,
          scaledSize: new google.maps.Size(15, 15)
        }
      }
    ];
    let busIcon, busStopIcon;
    const zoom = this.map.zoom;
    for (let i = 0; i < values.length; i++) {
      if (zoom >= values[i].minValue) {
        ({busIcon, busStopIcon} = values[i]);
        return {busIcon, busStopIcon};
      }
    }
    return values[0];
  }

  private async setupMapRoutes(): Promise<void> {
    const sections: Section[] = await this.busRouteProvider.getSections();
    console.log('setting up map routes');

    sections.forEach(section => {
      const points = section.positions.map(({latitude: lat, longitude: lng}) => ({lat, lng}));
      const busRoute = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.2,
        strokeWeight: 6
      });
      this.busRouteSectionLines.set(section.sectionId, busRoute);
    });

    const roundaboutCoords = [
      {lat: 51.377484, lng: -2.361208},
      {lat: 51.377484, lng: -2.361208},
      {lat: 51.377385, lng: -2.360370},
      {lat: 51.377337, lng: -2.359838},
      {lat: 51.377314, lng: -2.359773},
      {lat: 51.377296, lng: -2.359740},
      {lat: 51.377169, lng: -2.359606},
      {lat: 51.377153, lng: -2.359604},
      {lat: 51.377118, lng: -2.359625},
      {lat: 51.377085, lng: -2.359652},
      {lat: 51.377043, lng: -2.359702},
      {lat: 51.377004, lng: -2.359801},
      {lat: 51.377161, lng: -2.361322},
      {lat: 51.377194, lng: -2.361415},
      {lat: 51.377233, lng: -2.361461},
      {lat: 51.377278, lng: -2.361488},
      {lat: 51.377328, lng: -2.361506},
      {lat: 51.377371, lng: -2.361495},
      {lat: 51.377413, lng: -2.361458},
      {lat: 51.377434, lng: -2.361423},
      {lat: 51.377454, lng: -2.361383},
      {lat: 51.377480, lng: -2.361299},
      {lat: 51.377483, lng: -2.361218},
      {lat: 51.377484, lng: -2.361208}
    ];
    const roundabout = new google.maps.Polygon({
      paths: roundaboutCoords,
      strokeColor: '#505050',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#505050',
      fillOpacity: 0
    });
    roundabout.setMap(this.map);
    await this.updateBusRoutesVisibility();
  }

  private setupMapBuses() {
    this.events.subscribe('BusProvider:newBuses', buses => {
      this.buses = buses;
      this.addBusesToMap();
    });
  }

  private async setupMapBusStops() {
    try {
      this.busStops = await this.busStopProvider.getBusStops();
      this.busStops.forEach(busStop => {
        const {busStopIcon} = this.getCurrentIcons();
        const stopMarker = new google.maps.Marker({
          position: new google.maps.LatLng(busStop.location.latitude, busStop.location.longitude),
          title: busStop.busStopName,
          icon: busStopIcon
        });
        this.busStopMarkers.set(busStop.busStopId,stopMarker);
        google.maps.event.addListener(stopMarker, 'click', () => this.openBusStopPage(busStop.busStopId, busStop.busStopName));
      });
      this.updateBusStopsVisibility();
    } catch(e) {
      alert('error here!');
    }
  }

  public updateMapElementsVisibility() {
    this.updateBusRoutesVisibility();
    this.updateBusesVisibility();
    this.updateBusStopsVisibility();
  }

  private async updateBusRoutesVisibility() {
    try {
      const sectionsUsed = await this.getSectionsUsed();

      this.busRouteSectionLines.forEach((polyline, sectionId) => {
        if (sectionsUsed.indexOf(sectionId) !== -1) {
          polyline.setMap(this.map);
        } else {
          polyline.setMap(null);
        }
      });
    } catch(e) {
      console.log('how about here?');
    }
  }

  private updateBusesVisibility() {
    this.buses.forEach(bus => {
      if (this.busMarkers.has(bus.busId)) {
        const busMarker = this.busMarkers.get(bus.busId);
        if (this.getRoutesToShow().some(route => bus.routeName === route)) {
          if (busMarker.getMap() !== this.map) {
            busMarker.setMap(this.map);
          }
        } else {
          if (busMarker.getMap() !== null) {
            busMarker.setMap(null);
          }
        }
      } else {
        console.log('we have a bus, but no marker for it?!')
      }
    });
  }

  private updateBusStopsVisibility() {
    const shouldShowStop = (id): boolean => {
      return this.busStops
        .find(({busStopId}) => id === busStopId)
        .routes
        .some(route => this.getRoutesToShow().indexOf(route.name) !== -1);
    };

    this.busStopMarkers.forEach((stopMarker, id) => {
      if (shouldShowStop(id)) {
        if (stopMarker.getMap() !== this.map) stopMarker.setMap(this.map);
      } else {
        if (stopMarker.getMap() !== null) stopMarker.setMap(null);
      }
    });
  }

  private getRoutesToShow(): string[] {
    return this.routeStates
      .filter(({active}) => active)
      .map(({busRouteName}) => busRouteName);
  }

  private async getSectionsUsed(): Promise<number[]> {
    const busRoutes: BusRoute[] = await this.busRouteProvider.getBusRoutes();
    let sectionsToUse: Set<number> = new Set<number>();
    busRoutes.forEach(busRoute => {
      if (this.getRoutesToShow().indexOf(busRoute.busRouteName) !== -1) {
        busRoute.sectionsUsed.forEach(id => sectionsToUse.add(id));
      }
    });
    return Array.from(sectionsToUse);
  }

  private addBusesToMap() {
    const busIds = this.buses.map(({busId}) => busId);
    this.busMarkers.forEach((marker: google.maps.Marker, id: number) => {
      if (!busIds.some(i => i === id)) {
        marker.setMap(null);
        this.busMarkers.delete(id);
      }
    });
    this.buses.forEach(bus => this.addBusToMap(bus));
  }

  private addBusToMap(bus: Bus) {
    if (this.busMarkers.has(bus.busId)) {
      let busMarker = this.busMarkers.get(bus.busId);
      const prev = busMarker.getPosition().lng();
      if(prev - bus.location.longitude > 0){
        busMarker.setIcon(this.busIcons[this.zoom]);
      } else{
        busMarker.setIcon(this.busIcons[this.zoom + 3]);
      }
      this.animateMovement(busMarker, bus.location);
    } else {
      const {busIcon} = this.getCurrentIcons();
      let busMarker = new google.maps.Marker({
        position: new google.maps.LatLng(bus.location.latitude, bus.location.longitude),
        title: bus.routeName,
        icon: busIcon
      });
      this.busMarkers.set(bus.busId, busMarker);
      google.maps.event.addListener(busMarker, 'click', () => this.openBusPage(bus.busId, bus.routeName));
    }
    this.updateBusesVisibility();
  }

  private getMeAnSvg(): void {
    function addProps(e, props) {
      for (let prop in props) {
        let a = document.createAttribute(prop);
        a.value = props[prop];
        e.setAttributeNode(a);
      }
    }
    const svg = document.createElement('svg');
    const svgProps = {
      xmlns:"http://www.w3.org/2000/svg",
      version:"1.1",
      x:"0px",
      y:"0px",
      width:"512px",
      height:"512px",
      viewBox:"0 0 355.209 355.209",
      style:"enable-background:new 0 0 355.209 355.209;",
      'xml:space':"preserve"
    };
    addProps(svg, svgProps);
    const paths = [
      'M86.94,234.342c-17.69,0-32.025,14.332-32.025,32.022c0,17.691,14.335,32.021,32.025,32.021    c17.695,0,32.027-14.33,32.027-32.021C118.967,248.674,104.635,234.342,86.94,234.342z M86.94,280.288    c-7.69,0-13.921-6.231-13.921-13.922c0-7.693,6.23-13.921,13.921-13.921s13.925,6.228,13.925,13.921    C100.865,274.056,94.63,280.288,86.94,280.288z',
      'M274.949,234.342c-17.689,0-32.025,14.332-32.025,32.022c0,17.691,14.336,32.021,32.025,32.021    c17.695,0,32.027-14.33,32.027-32.021C306.977,248.674,292.645,234.342,274.949,234.342z M274.949,280.288    c-7.689,0-13.922-6.231-13.922-13.922c0-7.693,6.23-13.921,13.922-13.921s13.926,6.228,13.926,13.921    C288.875,274.056,282.639,280.288,274.949,280.288z" fill="#6b1c5d',
      'M336.068,56.823H42.101c-10.525,0-20.858,8.438-22.963,18.75L3.827,165.329C1.722,175.642,0,192.69,0,203.215    l0.957,44.014c0,10.523,8.611,19.136,19.136,19.136h29.08c0-20.823,16.941-37.763,37.766-37.763    c20.826,0,37.77,16.939,37.77,37.763h112.475c0-20.823,16.941-37.763,37.766-37.763c20.826,0,37.77,16.939,37.77,37.763h23.352    c10.525,0,19.139-8.612,19.139-19.136V75.959C355.205,65.434,346.594,56.823,336.068,56.823z M90.048,185.407H45.453l7.066-16.738    c1.233-2.921-0.134-6.289-3.055-7.522c-2.923-1.233-6.29,0.135-7.522,3.056l-8.921,21.127    c-16.668-0.736-19.058-6.767-17.708-14.035l5.092-34.401h69.644L90.048,185.407L90.048,185.407z M90.048,115.845H23.521    l4.95-33.441c1.441-7.761,9.078-14.111,16.973-14.111h44.604V115.845z M175.205,185.407H101.53v-48.512h73.675V185.407z     M175.205,115.845H101.53V68.292h73.675V115.845z M260.361,185.407h-73.676v-48.512h73.676V185.407z M260.361,115.845h-73.676    V68.292h73.676V115.845z M343.469,171.055c0,7.894-6.457,14.352-14.352,14.352h-57.275v-48.512h71.627V171.055L343.469,171.055z     M343.469,115.845h-71.627V68.292h57.275c7.895,0,14.352,6.458,14.352,14.353V115.845z" fill="#6b1c5d'
    ];

    const pathElems = paths.map(path => {
      const propy = {} as any;
      propy.d = path;
      propy.fill = '#6b1c5d';
      const e = document.createElement('path');
      //console.log(props);
      addProps(e, propy);
      return e;
    });
    pathElems.forEach(e => {
      svg.appendChild(e);
    });
  }

  //Animates the movement of a marker to a new longitude/latitude
  private async animateMovement(marker: google.maps.Marker, location: { latitude: number, longitude: number }) {
    function sleep(millis: number): Promise<void> {
      return new Promise(resolve => {
        setTimeout(() => resolve(), millis);
      });
    }

    function ease(x: number): number {
      return ((Math.sin((x - 0.5) * Math.PI)) + 1) / 2;
    }

    const timeToAnimate = 100;
    const fps = 24;
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
      await sleep(1000 / fps);
      marker.setPosition({lat, lng});
    }
  }


  //Opens the bus page with the bus info of the bus given.
  private openBusPage(busId, route) {
    let tryModal = this.modalCtrl.create(BusPage, {busId: busId, routeName: route, userPosition: this.userPosition});
    tryModal.present();
  }

  //Opens a bus stop page with the details of the bus stop
  private openBusStopPage(busStopId, busStopName) {
    let tryModal = this.modalCtrl.create(BusStopPage, {stopId: busStopId, stopName: busStopName});
    tryModal.present();
  }

}
