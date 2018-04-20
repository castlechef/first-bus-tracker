import { Component } from '@angular/core';
import {ViewController, IonicPage, NavParams, ModalController} from 'ionic-angular';
import {BusPage} from '../bus/bus';
import {BusStop, BusStopProvider} from '../../providers/bus-stop/bus-stop';

/**
 * Generated class for the BusStopPage page.
 */

@IonicPage()
@Component({
  selector: 'page-bus-stop',
  templateUrl: 'bus-stop.html',
})
export class BusStopPage {

  public title = "Bus Stop";
  private busStop: BusStop;
  private busStopName: string;
  private stopId;
  private interval: any;

  constructor(public navParams: NavParams, public viewctrl: ViewController, public modalctrl: ModalController, private busStopProvider: BusStopProvider) {
    //navParams : stopId stopName
    this.title = navParams.get('stopName');
    this.stopId = navParams.get('stopId');
    this.updateCurrentBusStop();
  }

  ionViewDidLoad() {
    console.log('Bus stop page loaded ' + this.stopId);
  }

  ngOnDestroy() {
    console.log('bus stop page being destroyed');
    clearInterval(this.interval);
  }

  private closeModal() {
    this.viewctrl.dismiss();
  }

  private infoUpdater() {
    this.interval = setInterval(() => {
      this.updateCurrentBusStop();
    }, 1000);
  }

  private async updateCurrentBusStop() {
    if (!this.busStop) {
      this.busStop = {
        busStopId: this.stopId,
        busStopName: this.busStopName,
        location: undefined,
        arrivals: []
      };
    }
    try {
      this.busStop = await this.busStopProvider.getBusStop(this.stopId);
    } catch(e) {
      console.log('cannot update current bus stop');
    }
  }

  private openBusPage(bus){
    let tryModal = this.modalctrl.create(BusPage, {busId: bus.busId, routeName: bus.routeName});
    tryModal.present();
  }
}



