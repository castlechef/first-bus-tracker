import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';

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

  public title = "BusStop";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController) {
    this.title = navParams.get('stopName');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusStopPage');
  }

  closeModal(){
    this.viewctrl.dismiss();
  }
}



