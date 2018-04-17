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
  // url for the api where the data is coming from
  //private _url: string = 'http://localhost:8080/';
  private _url: string = `http://localhost:${8080}/`;
  private buses: Bus[];

  constructor(private http: HttpClient) {
    this.buses = [];
    this.startBusFetchingBuses();
  }

  private startBusFetchingBuses() {
    setInterval(() => {
      this.http
        .get<any>(this._url.concat('buses'))
        .toPromise()
        .then(body => {
          this.buses = body.data;
        })
        .catch(e => {
          console.log('Error fetching buses data', e.message);
        })
    }, 1000);
  }


  // gets buses data and maps it to the observable Bus
  getBusLocations(): Bus[] {
    return this.buses;
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

  setCapacity(busId, capacity){
    console.log("attempting to set capacity:", capacity, "bus id:", busId);
    const url = this._url.concat('buses/',busId ,'/capacity');
    console.log(url);
    this.http.put<any>(url, capacity).toPromise().then(body=>{
      console.log(body);
    }, error=>{
      console.log("This didn't work:" , error);
    });
  }
}
