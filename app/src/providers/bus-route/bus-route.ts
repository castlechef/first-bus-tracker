import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

/*
  Generated class for the BusRouteProvider provider.
*/
@Injectable()
export class BusRouteProvider {

  private static readonly URL = `http://10.0.0.4:${8080}/busRoutes`;

  private sections: Section[];
  private busRoutes: BusRoute[];
  private hasReceivedData: boolean;

  constructor(public http: HttpClient) {
    this.hasReceivedData = false;
  }

  public getBusRoutes(): Promise<BusRoute[]> {
    return new Promise<BusRoute[]>((resolve, reject) => {
      this.ensureHasData()
        .then(() => {
          resolve(this.busRoutes);
        })
        .catch(err => {
          console.log('trying to get bus routes, but no data? server not connected?');
          reject();
        });
    });
  }

  public getSections(): Promise<Section[]> {
    return new Promise<Section[]>((resolve, reject) => {
      this.ensureHasData()
        .then(() => {
          resolve(this.sections);
        })
        .catch(err => {
          console.log('trying to get bus route sections, but no data? server not connected?');
          reject();
        });
    });
  }

  private ensureHasData(): Promise<void> {
    if (this.hasReceivedData) {
      return new Promise<void>(resolve => resolve());
    } else {
      return this.updateDataFromServer();
    }
  }

  private updateDataFromServer(): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this.http.get(BusRouteProvider.URL).toPromise().then(data => {
        const body = data as any;
        if (body.status === 'success') {
          this.sections = body.data.sections;
          this.busRoutes = body.data.busRoutes;
          this.hasReceivedData = true;
          resolve();
        } else {
          reject();
        }
      }).catch(error => {
        reject();
      });
    });
  }
}

export interface BusRoute {
  busRouteName: string;
  sectionsUsed: number[];
  order: number[]
}

export interface Section {
  sectionId: number;
  sectionDescription: string;
  positions: {
    latitude: number,
    longitude: number
  }[]
}
