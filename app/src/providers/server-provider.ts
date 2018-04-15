import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Bus} from '../bus.interface';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import {Stop} from '../stops.interface';
import {BusInfo} from '../busInfo.interface';
import {StopInfo} from '../stopInfo.interface';

@Injectable()
export class ServerProvider {
  data: any;
  // url for the api where the data is coming from
  private _url: string = 'http://localhost:8080/';

  constructor(private http: HttpClient) {
  }

  // gets buses data and maps it to the observable Bus
  getBusLocations(): Promise<Array<Bus>> {
    return new Promise<Array<Bus>>((resolve, reject) => {
      this.http
        .get<any>(this._url.concat('buses'))
        .toPromise().then(body => {
        resolve(body.data);
      }).catch(e => {
        reject(e);
      });
    })
  }

  getBusStopLocations(): Promise<Stop[]> {
    return new Promise<Stop[]>((resolve, reject) => {
      this.http
        .get<any>(this._url.concat('busStops'))
        .toPromise().then(body => {
        resolve(body.data);
      }).catch(e => {
        reject(e);
      });
    })
  }

  getBusInfo(number): Promise<BusInfo> {
    return new Promise<BusInfo>((resolve, reject) => {
      this.http
        .get<any>(this._url.concat('buses/' + number))
        .toPromise()
        .then(body => {
          resolve(body.data);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  getStopInfo(number): Promise<StopInfo> {
    return new Promise<StopInfo>((resolve, reject) => {
      this.http
        .get<any>(this._url.concat('busStops/' + number))
        .toPromise()
        .then(body => {
          resolve(body.data);
        }).catch(e => {
        reject(e);
      });
    })
  }
}
