import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //const map = new google.maps.Map();
    /**/
  }

  ionViewDidLoad() {
    console.log(this.mapElement);
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        center: new google.maps.LatLng(48.636111, -53.759722),
        zoom: 15,
        styles: [
          {
            featureType: "transit.station.bus",
            stylers: [
              { visibility: "off" }
            ]
          }
        ]
      }
    )
  }

}
