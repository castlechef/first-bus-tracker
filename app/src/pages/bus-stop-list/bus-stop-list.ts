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

  busStops: Stop[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public modalctrl: ModalController, public serverService: ServerProvider) {
    //navParams : stopId stopName
    this.busStops = [];
    this.serverService.getStopInfo('').then( array =>{
      this.busStops = array;
    }, err =>{
      console.log('error getting bus stops', err.message);
      this.busStops = [];
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusStopPage');
  }

  closeModal(){
    this.viewctrl.dismiss();
  }

  openBusStop(busStop){
    let tryModal = this.modalctrl.create(BusStopPage, {stopId: busStop.busStopId, stopName: busStop.busStopName});
    tryModal.present();
  }

}
