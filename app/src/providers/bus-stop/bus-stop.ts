import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Location} from '../bus/bus';
import {HOST} from '../../app/main';

/*
  Generated class for the BusStopProvider provider.
*/
@Injectable()
export class BusStopProvider {

  constructor(public http: HttpClient) {
    console.log('Hello BusStopProvider Provider');
  }

  public async getBusStops(): Promise<BusStop[]> {
    const body = await this.http.get(`${HOST}/busStops`).toPromise() as any;
    if (body.status === 'success') {
      return body.data;
    } else {
      return [];
    }
  }

  public async getBusStop(id: number): Promise<BusStop> {
    const body = await this.http.get(`${HOST}/busStops/${id}`).toPromise() as any;
    if (body.status === 'success') {
      return body.data;
    } else {
      throw new Error('getBusStop error in provider');
    }
  }

  // get all bus stops

  // get a specific bus stop

}

export type BusRoutePosition = {
  name: string;
  position: number;
}

export type BusStopArrivalTime = {
  busId: number;
  routeName: string;
  arrivalTime: string;
}

export type BusStop = {
  busStopId: number;
  busStopName: string;
  location: Location;
  routes?: BusRoutePosition[];
  arrivals?: BusStopArrivalTime[]
  isFav?: boolean;
}
