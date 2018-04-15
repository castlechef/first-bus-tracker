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

  nextBusStops: Array<{busStopId: number, busStopsName: string, arrivalTime: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public serverService: ServerProvider) {
    this.title = navParams.get('routeName');
    this.getBusInfo(navParams.get('busId')).then(busInfo =>{
      this.nextBusStops = busInfo;
    }, rejected => {
      console.log(rejected);
      this.nextBusStops = [];
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ' + this.nextBusStops);
  }

  closeModal(){
    this.viewctrl.dismiss();
  }

  private getBusInfo(busId) : Promise<Array<{busStopId: number, busStopsName: string, arrivalTime: string}>>{
    return new Promise<Array<{busStopId: number, busStopsName: string, arrivalTime: string}>>((resolve, reject) => {
      this.serverService.getBusInfo(busId).then(data=>{
        let gotten = data.arrivalTimes;
        resolve(gotten);
      }, rejected =>{
        reject(rejected);
      });
    });
  }

}
