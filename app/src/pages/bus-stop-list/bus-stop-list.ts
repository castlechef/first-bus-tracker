import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {ServerProvider} from '../../providers/server-provider';
import {BusStopPage} from '../bus-stop/bus-stop';
import {Stop} from '../../stops.interface';

/**
 * Generated class for the BusStopListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bus-stop-list',
  templateUrl: 'bus-stop-list.html',
})
export class BusStopListPage {

  public title = "Bus Stops";

  busStops: Array<Stop>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public modalctrl: ModalController, public serverService: ServerProvider) {
    //navParams : stopId stopName
    this.getBusStops().then( array =>{
      this.busStops = array;
    }, rejected =>{
      console.log(rejected);
      this.busStops = [];
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusStopPage');
  }

  closeModal(){
    this.viewctrl.dismiss();
  }

  private getBusStops() : Promise<Array<Stop>>{
    return new Promise<Array<Stop>>((resolve, reject)=>{
      this.serverService.getBusStopLocations().then(data=>{
        resolve(data);
      }, rejected =>{
        reject(rejected);
      });
    });
  }

  openBusStop(busStop){
    let tryModal = this.modalctrl.create(BusStopPage, {stopId: busStop.busStopId, stopName: busStop.busStopName});
    tryModal.present();
  }

}
