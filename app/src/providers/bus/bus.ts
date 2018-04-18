import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

/*
  Generated class for the BusProvider provider.
*/
@Injectable()
export class BusProvider {

  private buses: Bus[];
  private died: any;
  private timeout: any;

  constructor(public http: HttpClient, private events: Events) {
    console.log('Hello BusProvider Provider');
    this.died = false;
    this.startGettingBuses();
  }

  ngOnDestroy() {
    this.died = true;
    clearTimeout(this.timeout);
  }

  // get all buses
  private async startGettingBuses(): Promise<void> {
    const sleep = (millis: number) => {
      return new Promise(resolve => {
        this.timeout = setTimeout(() => {
          resolve();
        }, millis);
      })
    };

    while (!this.died) {
      try {
        let buses = await this.getBusesFromServer();
        this.events.publish('BusProvider:newBuses', buses);
        this.buses = buses;
      } catch(e) {

      } finally {
        await sleep(1000);
      }
    }
  }

  public getLatestBuses(): Bus[] {
    return this.buses;
  }

  private async getBusesFromServer(): Promise<Bus[]> {
    const body = await this.http
      .get('http://10.0.0.4:8080/buses')
      .toPromise() as any;
    return body.data;
  }

  // get a specific bus
  public async getBus(busId: number): Promise<Bus> {
    try {
      const body = await this.http
        .get(`http://10.0.0.4:8080/buses/${busId}`)
        .toPromise() as any;
      return body.data;
    } catch(e) {
      console.log(`BusProvider: cannot get bus ${busId}`);
    }
  }

  public async updateCapacity(capacity: string, busId: string): Promise<boolean> {
    try {
      const body = this.http
        .put(`http://10.0.0.4:8080/buses/${busId}/capacity`, {
          data: {capacity}
        })
        .toPromise() as any;
      return (body.status !== 'failure');
    } catch(e) {
      console.log(`BusProvider: cannot put bus capacity ${busId}, ${capacity}`);
      return false;
    }
  }

}

export type Location = {
  latitude: number;
  longitude: number;
}

export type BusDepartureTime = {
  busStopId: number;
  busStopName: string;
  departureTime: string;
}

export type BusArrivalTime = {
  busStopId: number;
  busStopName: string;
  departureTime: string;
}

export type Bus = {
  busId: number;
  location: Location;
  routeName: string;
  capacity?: string;
  departureTimes?: BusDepartureTime[];
  arrivalTimes?: BusArrivalTime[];
}
