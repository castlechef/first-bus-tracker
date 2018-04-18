import { Component } from '@angular/core';
import {Network} from '@ionic-native/network';

/**
 * Generated class for the NetworkWarningComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'network-warning',
  templateUrl: 'network-warning.html'
})
export class NetworkWarningComponent {

  sub: any;
  sub2: any;
  show: boolean;

  constructor(private network: Network) {
    this.show = !navigator.onLine;
    console.log('Hello NetworkWarningComponent Component');
    this.sub = this.network.onConnect().subscribe(() => {
      this.show = false;
    });
    this.sub2 = this.network.onDisconnect().subscribe(() => {
      this.show = true;
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

}
