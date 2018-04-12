import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusStopListPage } from './bus-stop-list';

@NgModule({
  declarations: [
    BusStopListPage,
  ],
  imports: [
    IonicPageModule.forChild(BusStopListPage),
  ],
})
export class BusStopListPageModule {}
