import {Component, OnInit} from '@angular/core';
import { ServerProvider } from '../../providers/server-provider';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html',
  providers: [ServerProvider]
})
export class Page2 implements OnInit {
  public buses: any = [];
  public stops: any = [];
  public errorMessage;
  public stopsErrorMsg;
  public busSubcription;
  public stopsSubcription;

  /**
   * imports all the necessary parameters
   * @param {NavController} navCtrl - for navigation
   * @param {ServerProvider} serverService - for getting buses
   * @param {StopsProvider} stopsService - for getting bus stops
   */
  constructor(public navCtrl: NavController, public serverService: ServerProvider){
    //this.loadBuses();
  }

  ngOnInit(){
    /**
     * subscribes to the data for the buses coming from its provider
     * @type {Subscription}
     */
    this.busSubcription = this.serverService.getBusLocations()
      .subscribe(data => {
        this.buses = data;
        console.log(this.buses.status);
        this.buses = this.buses.data;
        console.log(this.buses);
      },
      error => this.errorMessage = error);

    /**
     * subscribes to the data for the bus stops coming from its provider
     * @type {Subscription}
     */
    this.stopsSubcription = this.serverService.getBusStopLocations()
      .subscribe(data=> {
        this.stops = data;
        console.log(this.stops.status);
        this.stops  = this.stops.data;
        console.log(this.stops);
      },
        error => this.stopsErrorMsg = error);
  }

  /**
   * when the page is closed so to is the subscriptions to the providers
   * if this isn't done these won't be cleared from memory
   */
  ngOnDestroy(){
    this.busSubcription.unsubscribe();
    this.stopsSubcription.unsubscribe();
  }


}
