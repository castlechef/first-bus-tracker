import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bus } from '../bus.interface';
import {Observable} from 'rxjs/Observable';
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
    return new Promise<Array<Bus>>(resolve => {
      const subscription = this.http.get<Bus[]>(this._url.concat('buses')).catch(this.errorHandler).subscribe( data => {
        resolve(data.data);
        subscription.unsubscribe();
      });
    })
  }

  getBusStopLocations(): Promise<Stop[]>{
    return new Promise<Stop[]>(resolve => {
      const subscription = this.http.get<Stop[]>(this._url.concat('busStops')).catch(this.errorHandler).subscribe( data => {
        resolve(data);
        subscription.unsubscribe();
      });
    })
  }

  getBusInfo(number): Observable<BusInfo>{
    return this.http.get<BusInfo>(this._url.concat('buses/' + number)).catch(this.errorHandler);
  }

  getStopInfo(number): Observable<StopInfo>{
    return this.http.get<StopInfo>(this._url.concat('busStops/' + number)).catch(this.errorHandler);
  }
  // catches any errors during the getLocations()
  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message || "Server Error");
  }

}
