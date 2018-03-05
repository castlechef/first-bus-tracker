import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusStopPage } from './bus-stop';

@NgModule({
  declarations: [
    BusStopPage,
  ],
  imports: [
    IonicPageModule.forChild(BusStopPage),
  ],
})
export class BusStopPageModule {}
