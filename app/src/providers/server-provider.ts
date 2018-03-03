import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bus } from '../bus.interface';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class ServerProvider {
  data: any;
  private _url: string = 'http://localhost:8080/buses';

  constructor(private http: HttpClient){}

  getLocations(): Observable<Bus[]>{
    return this.http.get<Bus[]>(this._url).catch(this.errorHandler);
  }

  errorHandler(error: HttpErrorResponse){
    return Observable.throw(error.message || "Server Error");
  }

  /*
  load(){
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http
        .get(this._url)
        .catch(this.errorHandler)
        .subscribe(data => {
          // in this promise is where we get all the data from the api
          // test server is being used in this instance
          this.data = data;
          resolve(this.data);
          console.log(this.data);
        });

    });


  }
  */

}
