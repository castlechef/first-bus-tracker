import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bus } from '../bus.interface';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class ServerProvider {
  data: any;
  // url for the api where the data is coming from
  private _url: string = 'http://localhost:8080/buses';

  constructor(private http: HttpClient){}

  // gets buses data and maps it to the observable Bus
  getLocations(): Observable<Bus[]>{
    return this.http.get<Bus[]>(this._url).catch(this.errorHandler);
  }

  // catches any errors during the getLocations()
  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message || "Server Error");
  }

}