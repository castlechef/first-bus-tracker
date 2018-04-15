import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MapPage} from '../map/map';

/**
 * Generated class for the MapOptionsPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-options-popover',
  templateUrl: 'map-options-popover.html',
})
export class MapOptionsPopoverPage {

  private map: MapPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.map = navParams.data.mapPage;
    console.log(this.map);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapOptionsPopoverPage');
  }

  updateState(routeState) {
    console.log('updating state',routeState);
    routeState.active = !routeState.active;
    this.map.updateBusRouteBeingUsed();
  }

}
