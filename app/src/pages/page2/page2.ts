import {Component, OnInit} from '@angular/core';
import { ServerProvider } from '../../providers/server-provider';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html',
  providers: [ServerProvider]
})
export class Page2 implements OnInit {
  public buses: any = [];
  public errorMessage;

  constructor(public navCtrl: NavController, public serverService: ServerProvider){
    //this.loadBuses();
  }

  ngOnInit(){
    this.serverService.getLocations()
      .subscribe(data => {
        this.buses = data;
        console.log(this.buses.status);
        this.buses = this.buses.data;
        console.log(this.buses);
      },
      error => this.errorMessage = error);

  }


}

/*
    <ion-row *ngFor="let bus of buses">
      <ion-col>{{bus.busId}}</ion-col>
      <ion-col>{{bus.location.latitude}}</ion-col>
      <ion-col>{{bus.location.longitude}}</ion-col>
    </ion-row>
 */
