import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    this.loadMap()
      .then(() => {
        this.addBusStops();
        this.addBusRoutes();
      });
  }

  loadMap(): Promise<null> {
    return new Promise<null>(resolve => {
      this.geolocation.getCurrentPosition()
        .then((position) => {
          let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.createMap(latLng, true);
          resolve();
        }, (err) => {
          let latLng = new google.maps.LatLng(51.377981, -2.359026);
          this.createMap(latLng, false);
          console.log(err);
          resolve();
        });
    });
  }

  createMap(latLng: Object, locationObtained: Boolean) {
    let mapOptions = {
      center: latLng,
      zoom: 15,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let userPosition = new google.maps.Marker({
      map: this.map,
      position: latLng,
      title: 'Your Position',
      visible: locationObtained
    });
  }

  addBusStops() {
    let testStop = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(51.377954, -2.357883),
      title: 'testing stop'
    });

    google.maps.event.addListener(testStop, 'click', () => {
      this.navCtrl.push(BusStopPage, {
        stopID: 1
      });
    });
  }

  addBusRoutes() {
    let exampleBusRouteCoordinates = [
      {lat: 51.378739, lng: -2.325066},
      {lat: 51.377843, lng: -2.325291}
    ];

    let exampleBusRoute = new google.maps.Polyline({
      path: exampleBusRouteCoordinates,
      geodesic: true,
      strokeColor: '#ca12ff',
      strokeOpacity: 0.8,
      strokeWeight: 3
    });

    exampleBusRoute.setMap(this.map);
  }
}
