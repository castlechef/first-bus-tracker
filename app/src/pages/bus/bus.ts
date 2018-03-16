import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bus',
  templateUrl: 'bus.html',
})
export class BusPage {

  public title = "Bus";

  private exampleBusStops = [
    {
      "routeName": "U1X",
      "location": {
        "latitude": 51.368600,
        "longitude": -2.336717
      },
      "nextBusStops": [
        {"busStopId": 1, "busStopName": "Arrival's Square (Stop A)"},
        {"busStopId": 5, "busStopName": "Youth Hostel"}
      ],
      "capacity": 0
    },
    {
      "routeName": "U2",
      "location": {
        "latitude": 51.368438,
        "longitude": -2.355729
      },
      "nextBusStops": [
        {"busStopId": 2, "busStopName": "Arrival's Square (Stop C)"},
        {"busStopId": 5, "busStopName": "Youth Hostel"}
      ],
      "capacity": 0
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController) {
    this.title = navParams.get('routeName');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusPage');
  }

  closeModal(){
    this.viewctrl.dismiss();
  }

}
