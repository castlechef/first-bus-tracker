import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';
import {ServerProvider} from '../../providers/server-provider';
import { BusInfo } from '../../busInfo.interface';
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
  public busId;
  private capacities = ["UNKNOWN", "EMPTY", "QUIET", "BUSY", "FULL"];
  nextBusStops: Array<{ busStopId: number, busStopsName: string, arrivalTime: string }>;

  public capacity: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public serverService: ServerProvider) {
    this.title = navParams.get('routeName');
    this.busId = navParams.get('busId');
    this.getBusInfo(navParams.get('busId')).then(busInfo => {
      this.nextBusStops = busInfo.arrivalTimes;
      this.capacity = busInfo.capacity;
    }, rejected => {
      console.log(rejected);
      this.capacity = "UNKNOWN";
      this.nextBusStops = [];
    });
    this.infoUpdater();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ' + this.nextBusStops);
  }

  closeModal() {
    this.viewctrl.dismiss();
  }

  private infoUpdater() {
    setInterval(() => {
      this.getBusInfo(this.busId).then(busInfo => {
        this.nextBusStops = busInfo.arrivalTimes;
        this.capacity = busInfo.capacity;
      }, rejected => {
        console.log(rejected);
      });
    }, 1000)
  }

  private getBusInfo(busId): Promise<BusInfo> {
    return new Promise<BusInfo>((resolve, reject) => {
      this.serverService.getBusInfo(busId).then(data => {
        resolve(data);
      }, rejected => {
        reject(rejected);
      });
    });
  }

  private inputCapacity(number){
    this.serverService.setCapacity(this.busId, this.capacities[number]);
  }
}
