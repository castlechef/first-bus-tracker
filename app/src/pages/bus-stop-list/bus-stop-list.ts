import {Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {ServerProvider} from '../../providers/server-provider';
import {BusStopPage} from '../bus-stop/bus-stop';
import {Stop} from '../../stops.interface';
import {SettingsProvider} from '../../providers/settings/settings';

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

  public title = 'Bus Stops';

  busStops: Stop[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewctrl: ViewController,
    public modalctrl: ModalController,
    public serverService: ServerProvider,
    private alertCtrl: AlertController,
    private settings: SettingsProvider
  ) {
    //navParams : stopId stopName
    this.busStops = [];
    this.serverService.getStops()
      .then(array => {
        this.busStops = array;
        this.setupBusStops();
        this.setupFavs();
      }, err => {
        console.log('error getting bus stops', err.message);
        this.busStops = [];
      });
  }

  private setupBusStops() {
    this.busStops = this.busStops.sort((s1, s2) => s1.busStopName > s2.busStopName ? 1 : -1);
    this.setupFavs();
    const favs = this.busStops.filter(({isFav}) => isFav);
    const nonFavs = this.busStops.filter(({isFav}) => !isFav);
    nonFavs.forEach(e => favs.push(e));
    this.busStops = favs;
  }

  private setupFavs() {
    const favs = this.settings.getFavourites();
    this.busStops.forEach(busStop => {
      if (favs.indexOf(busStop.busStopName) !== -1) {
        busStop.isFav = true;
      }
    })
  }

  ionViewWillEnter() {
    this.viewctrl.showBackButton(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusStopPage');
  }

  closeModal() {
    this.viewctrl.dismiss();
  }

  openBusStop(busStop) {
    let tryModal = this.modalctrl.create(BusStopPage, {stopId: busStop.busStopId, stopName: busStop.busStopName});
    tryModal.present();
  }

  presentConfirm(busStop) {
    let alert = this.alertCtrl.create({
      title: 'Confirm favourite',
      message: `Are you sure you want to ${busStop.isFav ? 'remove' : 'add'} ${busStop.busStopName} as a favourite?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.doAThing(busStop);
          }
        }
      ]
    });
    alert.present();
  }

  private async doAThing(busStop) {
    console.log('eaayhhhhhh added!');
    if (busStop.isFav) {
      await this.settings.removeFavouriteStop(busStop.busStopName);
    } else {
      await this.settings.addFavouriteStop(busStop.busStopName);
    }
    busStop.isFav = !busStop.isFav;
    this.setupBusStops();
  }
}
