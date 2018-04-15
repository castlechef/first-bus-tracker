import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapOptionsPopoverPage } from './map-options-popover';

@NgModule({
  declarations: [
    MapOptionsPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(MapOptionsPopoverPage),
  ],
})
export class MapOptionsPopoverPageModule {}
