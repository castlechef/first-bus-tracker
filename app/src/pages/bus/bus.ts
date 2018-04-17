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
  public capacityDisplay: string;
  public capacityInput = true;
  public capacityDisplayStyle: object;
  nextBusStops: Array<{ busStopId: number, busStopsName: string, arrivalTime: string }>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public serverService: ServerProvider) {
    this.title = navParams.get('routeName');
    this.busId = navParams.get('busId');
    this.getBusInfo(navParams.get('busId')).then(busInfo => {
      this.nextBusStops = busInfo.arrivalTimes;
      this.capacity = busInfo.capacity;
      this.writeCapacityDisplay(busInfo.capacity);
    }, rejected => {
      console.log(rejected);
      this.capacity =  "Can't connect to server";
      this.writeCapacityDisplay("UNKNOWN");
      this.nextBusStops = [];
    });
    //this.infoUpdater();
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
    this.capacity = capacities[number];
    console.log(capacities[number]);
    this.writeCapacityDisplay(capacities[number]);
  }

  private submitCapacity() {
    this.serverService.setCapacity(this.busId, this.capacity);
    this.capacityInput = false;
  }

  private dismissCapacity() {
    this.capacityInput = false;
  }

  private writeCapacityDisplay(capacity){
    switch(capacity){
      case "UNKNOWN":
        this.capacityDisplay = "The capacity of this bus is currently unknown";
        this.capacityDisplayStyle = {'background-color': 'white'};
        break;
      case "EMPTY":
        this.capacityDisplay = "This bus is empty";
        this.capacityDisplayStyle = {'background-color': 'green'};
        break;
      case "QUIET":
        this.capacityDisplay = "This bus is quiet";
        this.capacityDisplayStyle = {'background-color': 'white'};
        break;
      case "BUSY":
        this.capacityDisplay = "This bus is busy";
        this.capacityDisplayStyle = {'background-color': 'white'};
        break;
      case "FULL":
        this.capacityDisplay = "This bus is full";
        this.capacityDisplayStyle = {'background-color': 'white'};
        break;
      default:
        this.capacityDisplay = "If this displays, refresh the app.";
        this.capacityDisplayStyle = {'background-color': 'red'};
    }
  }
}
