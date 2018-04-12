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

  buses: Array<{routeName: string, arrivalTime: string, busId: number}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public modalctrl: ModalController, public serverService: ServerProvider) {
    //navParams : stopId stopName
    this.title = navParams.get('stopName');
    this.getBusStopData(navParams.get('stopId')).then( array =>{
      this.buses = array;
    }, rejected =>{
      console.log(rejected);
      this.buses = [];
    }); /*[
      { busRoute: 'U1', arrivalTime: "09:50", busId: 1},
      { busRoute: 'U1X', arrivalTime: "09:53", busId: 2}//oiihADXINA
    ];*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusStopPage');
  }

  closeModal(){
    this.viewctrl.dismiss();
  }

  private getBusStopData(stopId) : Promise<Array<{routeName: string, arrivalTime: string, busId: number}>>{
    return new Promise<Array<{routeName: string, arrivalTime: string, busId: number}>>((resolve, reject)=>{
      this.serverService.getStopInfo(stopId).then(data=>{
        resolve(data.arrivals);
      }, rejected =>{
        reject(rejected);
      });
    });
  }

  openBus(bus){
    let tryModal = this.modalctrl.create(BusPage, {busId: bus.busId, routeName: bus.busRoute});
    tryModal.present();
  }
}



