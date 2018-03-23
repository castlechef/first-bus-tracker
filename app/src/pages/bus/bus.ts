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

  nextBusStops: Array<{busStopId: number, busStopName: string, expectedArrival: string}>;

  private exampleBusStops =
    {
      "routeName": "U1X",
      "location": {
        "latitude": 51.368600,
        "longitude": -2.336717
      },
      "nextBusStops": [
        {"busStopId": 1, "busStopName": "Arrival's Square (Stop A)", "expectedArrival": "09:23"},
        {"busStopId": 5, "busStopName": "Youth Hostel", "expectedArrival": "10:11"}
      ],
      "capacity": 0
    }; //doaihdoaisdnaso

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController) {
    this.title = navParams.get('routeName');
    this.nextBusStops = [
      {busStopId: 1, busStopName: "Arrival's Square (Stop A)", expectedArrival: "09:23"},
      {busStopId: 5, busStopName: "Youth Hostel", expectedArrival: "10:11"}
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusPage');
  }

  closeModal(){
    this.viewctrl.dismiss();
  }

}
