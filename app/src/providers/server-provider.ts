import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bus } from '../bus.interface';
import {Observable, ObservableInput} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Stop} from '../stops.interface';
import { BusInfo } from '../busInfo.interface';
import { StopInfo } from '../stopInfo.interface';


@Injectable()
export class ServerProvider {
  data: any;
  // url for the api where the data is coming from
  private _url: string = 'http://localhost:8080/';

  constructor(private http: HttpClient){}

  // gets buses data and maps it to the observable Bus
  getBusLocations() : Promise<Array<Bus>>{
    return new Promise<Array<Bus>>((resolve,reject) => {
      const subscription = this.http.get<Bus[]>(this._url.concat('buses')).catch(e => Observable.throw(this.errorHandler(e, reject)))
        .subscribe( data => {
        resolve(data.data);
        subscription.unsubscribe();
      });
    })
  }

  getBusStopLocations(): Promise<Stop[]>{
    return new Promise<Stop[]>((resolve,reject) => {
      const subscription = this.http.get<Stop[]>(this._url.concat('busStops')).catch(e => Observable.throw(this.errorHandler(e, reject)))
        .subscribe( data => {
        resolve(data);
        subscription.unsubscribe();
      });
    })
  }

  getBusInfo(number): Promise<BusInfo>{
    return new Promise<BusInfo>((resolve, reject) => {
      const subscription = this.http.get<BusInfo>(this._url.concat('buses/' + number)).catch(e => Observable.throw(this.errorHandler(e, reject)))
        .subscribe( data => {
        resolve(data.data);
        subscription.unsubscribe();
      });
    })
  }

  getStopInfo(number): Promise<StopInfo>{
    return new Promise<StopInfo>((resolve, reject) => {
      const subscription = this.http.get<StopInfo>(this._url.concat('busStops/' + number)).catch(e => Observable.throw(this.errorHandler(e, reject)))
        .subscribe( data => {
        resolve(data.data);
        subscription.unsubscribe();
      });
    })
  }

  errorHandler(error: any, reject: any): void {
    reject(error);
    console.log(error)
  }
}
