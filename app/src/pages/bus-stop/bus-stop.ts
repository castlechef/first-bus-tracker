import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BusStopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bus-stop',
  templateUrl: 'bus-stop.html',
})
export class BusStopPage {

  public title = "BusStop";

  buses: Array<{ busRoute: string, arrivalTime: string }>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController) {
    this.title = navParams.get('stopName');
    this.buses = [
      { busRoute: 'U1', arrivalTime: "09:50" },
      { busRoute: 'U1X', arrivalTime: "09:53" }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusStopPage');
  }

  closeModal(){
    this.viewctrl.dismiss();
  }

  /*"busStopId": 1,
                "busStopName": "Junction Road",
                "location": {
                    "latitude": 52.3456546,
                    "longitude": -1.3465544
                },
                "busRoutePosition": [
                    {
                        "name": "U1X",
                        "position": 4
                    },
                    {
                        "name": "U1",
                        "position": 7
                    }
                ],
                "arrivals": [
                    {
                        "busId": 1,
                        "routeName": "U1",
                        "arrivalTime": "09:50"
                    },
                    {
                        "busId": 2,
                        "routeName": "U1X",
                        "arrivalTime": "09:53"
                    }
                ]*/
}



