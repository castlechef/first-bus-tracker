import {Component} from '@angular/core';
import {ViewController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ServerProvider} from '../../providers/server-provider';
import {BusInfo} from '../../busInfo.interface';

/**
 * Generated class for the BusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


enum capacities {'UNKNOWN', 'EMPTY', 'QUIET','BUSY', 'FULL'}

@IonicPage()
@Component({
  selector: 'page-bus',
  templateUrl: 'bus.html',
})
export class BusPage {

  public busId;
  public title = 'Bus';
  public capacity: string;
  public sub_capacity: string;
  public capacityDisplay: string;
  public capacityInput = true;
  public capacityShown = false;
  public nextBusStops: Array<{ busStopId: number, busStopsName: string, arrivalTime: string }>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public serverService: ServerProvider) {
    this.title = navParams.get('routeName');
    this.busId = navParams.get('busId');
    this.getBusInfo(navParams.get('busId')).then(busInfo => {
      console.log(busInfo);
      this.nextBusStops = busInfo.arrivalTimes;
      this.capacity = busInfo.capacity;
      if(this.distanceClose(busInfo.location, {latitude: 0.0, longitude: 0.0})){
        this.capacityInput = true;
      } else {
        this.writeCapacityDisplay(busInfo.capacity);
      }
    }, rejected => {
      console.log(rejected);
      this.capacity =  "UNKNOWN";
      this.writeCapacityDisplay("UNKNOWN");
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

  public distanceClose(busPosition, userPosition){
    function toRadians(n: number): number { return n * Math.PI / 180; }
    const R = 6371e3;
    const theta1 = toRadians(busPosition.latitude);
    const theta2 = toRadians(userPosition.latitude);
    const deltaTheta = toRadians(userPosition.latitude - busPosition.latitude);
    const deltaLamda = toRadians(userPosition.longitude - busPosition.longitude);
    const a = (Math.sin(deltaTheta / 2) ** 2) + (Math.cos(theta1) * Math.cos(theta2) * (Math.sin(deltaLamda / 2) ** 2));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c < 50;
  }

  private infoUpdater() {
    setInterval(() => {
      this.getBusInfo(this.busId).then(busInfo => {
        this.nextBusStops = busInfo.arrivalTimes;
        this.capacity = busInfo.capacity;
        this.writeCapacityDisplay(busInfo.capacity);
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

  private inputCapacity(number) {
    this.sub_capacity = capacities[number];
  }

  private submitCapacity() {
    this.serverService.setCapacity(this.busId, this.sub_capacity);
    this.capacityInput = false;
    this.writeCapacityDisplay(this.capacity);
  }

  private dismissCapacity() {
    this.writeCapacityDisplay(this.capacity);
    this.capacityInput = false;
  }

  private writeCapacityDisplay(capacity){
    switch(capacity){
      case "EMPTY":
        this.capacityDisplay = "This bus is empty";
        this.capacityShown = true;
        break;
      case "QUIET":
        this.capacityDisplay = "This bus is quiet";
        this.capacityShown = true;
        break;
      case "BUSY":
        this.capacityDisplay = "This bus is busy";
        this.capacityShown = true;
        break;
      case "FULL":
        this.capacityDisplay = "This bus is full";
        this.capacityShown = true;
        break;
      default:
        this.capacityDisplay = "";
        this.capacityShown = false;
    }
  }
}
