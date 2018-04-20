import {Component} from '@angular/core';
import {ViewController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ServerProvider} from '../../providers/server-provider';
import {BusInfo} from '../../busInfo.interface';
import {Bus, BusProvider} from '../../providers/bus/bus';

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

  private busId: number;
  private title = 'Bus';
  private bus: Bus;
  private capacity: string;
  private sliderValue: any;
  private sub_capacity: string;
  private capacityDisplay: string;
  private capacityInput = true;
  private capacityShown = false;
  private interval: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, private busProvider: BusProvider) {
    this.title = navParams.get('routeName');
    this.busId = navParams.get('busId');
    this.bus = {busId: this.busId, location: undefined, routeName: this.title, arrivalTimes: []};

    this.busProvider.getBus(this.busId)
      .then((bus: Bus) => {
        this.bus = bus;
        if (this.distanceClose(bus.location, {latitude: 0, longitude: 0})) {
          this.capacityInput = true;
        } else {
          this.writeCapacityDisplay(bus.capacity);
        }
      })
      .catch(err => {
        this.capacity = "UNKNOWN";
      });
    this.infoUpdater();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
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
    this.interval = setInterval(() => {
      this.busProvider.getBus(this.busId)
        .then((bus: Bus) => {
          this.bus = bus;
          this.writeCapacityDisplay(bus.capacity);
        })
        .catch(err => {

        });
    }, 1000)
  }

  private inputCapacity(number) {
    if (number === undefined) {
      this.sub_capacity = capacities[1];
    } else {
      this.sub_capacity = capacities[number];
    }
  }

  private submitCapacity() {
    this.inputCapacity(this.sliderValue);
    this.busProvider.updateCapacity(this.sub_capacity, this.busId);
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
