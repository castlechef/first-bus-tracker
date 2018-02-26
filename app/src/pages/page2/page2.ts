import { Component } from '@angular/core';
import { ServerProvider } from '../../providers/server-provider';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html',
  providers: [ServerProvider]
})
export class Page2 {
  public buses: any = [];

  constructor(public navCtrl: NavController, public serverService: ServerProvider){
    this.loadBuses();
  }

  loadBuses(){
    this.serverService.load()
      .then(data => {
        this.buses = data;
        // actual data needed is in buses.data
        this.buses = this.buses.data;
        console.log(this.buses);
      });
  }


}
