import { Component } from '@angular/core';
import {ViewController, IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {BusPage} from '../bus/bus';
import { ServerProvider} from '../../providers/server-provider';

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

  public title = "Bus Stop";
  private stopId;

  buses: Array<{routeName: string, arrivalTime: string, busId: number}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public modalctrl: ModalController, public serverService: ServerProvider) {
    //navParams : stopId stopName
    this.title = navParams.get('stopName');
    this.stopId = navParams.get('stopId');
    this.getBusStopData(navParams.get('stopId')).then( array =>{
      this.buses = array;
    }, rejected => {
      this.buses = [];
      console.log(rejected);
    });
    this.infoUpdater();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad' + this.navParams.get('stopId'));
  }

  closeModal(){
    this.viewctrl.dismiss();
  }

  private infoUpdater() {
    setInterval(() => {
      this.getBusStopData(this.stopId).then(stopInfo => {
        this.buses = stopInfo;
      }, rejected => {
        console.log(rejected);
      });
    }, 1000)
  }

  private getBusStopData(stopId) : Promise<Array<{routeName: string, arrivalTime: string, busId: number}>>{
    return new Promise<Array<{routeName: string, arrivalTime: string, busId: number}>>((resolve, reject)=>{
      this.serverService.getStopInfo(stopId).then(data=>{
        resolve(data.arrivals);
      }, rejected => {
        reject(rejected);
      });
    });
  }

  openBus(bus){
    let tryModal = this.modalctrl.create(BusPage, {busId: bus.busId, routeName: bus.routeName});
    tryModal.present();
  }
}



