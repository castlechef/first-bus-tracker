import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bus',
  templateUrl: 'bus.html',
})
export class BusPage {

  public title = "Bus";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController) {
    this.title = navParams.get('routeName');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusPage');
  }

  closeModal(){
    this.viewctrl.dismiss();
  }

}
