import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stop } from '../stops.interface';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class StopsProvider {
  data: any;

  // url for the API where the data is coming from
  private _url: string = 'http://localhost:8080/busStops';

  constructor(private http: HttpClient){}

  // gets stops and maps them to the observable Stop
  getStops(): Observable<Stop[]>{
    return this.http.get<Stop[]>(this._url).catch(this.errorHandler);
  }

  // catches any possible errors
  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message || "Server Error");
  }

}
