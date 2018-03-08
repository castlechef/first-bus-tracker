import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App) {
  }

  ionViewDidLoad() {
    this.title = this.navParams.get('stopName');
    console.log('ionViewDidLoad BusStopPage');
  }

}
