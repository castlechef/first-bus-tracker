import { NgModule } from '@angular/core';
import {NetworkWarningComponent} from './network-warning/network-warning';
import {IonicModule} from 'ionic-angular';
import {Network} from '@ionic-native/network';

@NgModule({
	declarations: [NetworkWarningComponent],
	imports: [
	  IonicModule
  ],
	exports: [NetworkWarningComponent],
  providers: [Network]
})
export class ComponentsModule {}
