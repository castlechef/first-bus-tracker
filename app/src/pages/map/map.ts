import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {BusStopPage} from '../bus-stop/bus-stop';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  private busStopMarkers: Map<number, google.maps.Marker>;
  private busRouteLines: Map<String, google.maps.Polyline>;
  private colors = ["#bb72e0","#90b2ed", "#049310", "#f9f06d", "#ffc36b", "#f7946a", "#ef60ff"];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalctrl: ModalController) {
    this.busStopMarkers = new Map<number, google.maps.Marker>();
    this.busRouteLines = new Map<String, google.maps.Polyline>();
  }


  ionViewDidLoad() {
    this.loadMap()
      .then((latLng) => {
        if(latLng != null) this.addUserPositionMarker(latLng);
        this.addBusStops();
        this.addBusRoutes();
      });
  }

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
        console.log("Permission denied");
        resolve(null);
      });
    });
  }

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

  private addUserPositionMarker(latLng){
    let userPosition = new google.maps.Marker({
      map: this.map,
      position: latLng,
      title: 'Your Position',
    });

    navigator.geolocation.watchPosition((position) =>{
      userPosition.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    });
  }

  /*
   {
      'busStopId': 1,
      'busStopName': "University of Bath",
      'location': {
        'latitude': 51,377954,
        'longitude': -2.357883
      }
      'routes':[
       {'name':"U1X", 'position': 1},
       {'name':"U1", 'position': 1}
      ]
    }
   */

  private addBusStops() {
    const busStops = [
      {
        'busStopId': 0,
        'busStopName': 'University of Bath',
        'location': {
          'latitude': 51.377954,
          'longitude': -2.377843
        },
        'routes': [
          {'name': 'U1X', 'position': 1},
          {'name': 'U1', 'position': 1}
        ]
      },
      {
        'busStopId': 1,
        'busStopName': 'University of Bath U2',
        'location': {
          'latitude': 51.377957,
          'longitude': -2.357885
        },
        'routes': [
          {'name': 'U2', 'position': 1}
        ]
      }];

    for (let i = 0; i < busStops.length; i++) {
      let stopMarker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(busStops[i].location.latitude, busStops[i].location.longitude),
        title: busStops[i].busStopName
      });

      this.busStopMarkers.set(busStops[i].busStopId, stopMarker);
      google.maps.event.addListener(stopMarker, 'click', () => this.openBusStopPage(busStops[i].busStopId, busStops[i].busStopName));
    }
  }

  private openBusStopPage(busStopID, busStopName) {
    let tryModal = this.modalctrl.create(BusStopPage, {stopID: busStopID, stopName: busStopName});
    tryModal.present();

    /*this.navCtrl.push(BusStopPage, {
      stopID: busStopID,
      stopName: busStopName
    });*/
  }

  private addBusRoutes() {
    const exampleBusRouteCoordinates = [
      {
        'routeName' : 'U1X',
        'positions' : [
          {latitude: 51.378739, longitude: -2.325066},
          {latitude: 51.377843, longitude: -2.325291}
        ]
      },
      {
        'routeName': 'U1',
        'positions' : [
          {latitude: 51.378739, longitude: -2.325066}, //lat lng
          {latitude: 51.377843, longitude: -2.325291}
        ]
      }
    ];


    for(let i = 0; i < exampleBusRouteCoordinates.length; i++){
      let busRoutePath = exampleBusRouteCoordinates[i].positions;
      const googleMapStyle = busRoutePath.map(({latitude, longitude}) => {
        return {lat: latitude, lng: longitude}
      });

      let busRoute = new google.maps.Polyline({
        path: googleMapStyle,
        geodesic: true,
        strokeColor: this.colors[i%7],
        strokeOpacity: 0.8,
        strokeWeight: 3
      });

      this.busRouteLines.set(exampleBusRouteCoordinates[i].routeName, busRoute);

      busRoute.setMap(this.map);
    }
  }
}
