import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';
import {ServerProvider} from '../../providers/server-provider';

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

  nextBusStops: Array<{busStopId: number, busStopName: string, arrivalTime: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public serverService: ServerProvider) {
    this.title = navParams.get('routeName');
    this.getBusInfo(navParams.get('busId')).then(busInfo =>{
      this.nextBusStops = busInfo;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusPage');
  }

  closeModal(){
    this.viewctrl.dismiss();
  }

  private getBusInfo(busId) : Promise<Array<{busStopId: number, busStopName: string, arrivalTime: string}>>{
    return new Promise<Array<{busStopId: number, busStopName: string, arrivalTime: string}>>(resolve => {
      this.serverService.getBusInfo(busId).then(data=>{
        resolve(data.expectedArrivals);
      });
    });
  }

}
