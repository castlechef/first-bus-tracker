import {BusStop} from './busStop';
import {Jsonable} from './response';

export enum BusRouteName {
    U1_CITY = 'U1 City Centre',
    U1_OLDFIELD = 'U1 Oldfield Park',
    U1_ABBEY = 'U1 Bath Abbey',
    U1X = 'U1X',
    U2 = 'U2'
}

export class BusRoutes implements Jsonable {
    private stops: BusStop[];

    constructor(stops: BusStop[]) {
        this.stops = stops;
    }

    public getStopsWithRoute(busRouteName: BusRouteName): BusStop[] {
        return this.stops.reduce(stop => stop.hasRoute(busRouteName));
    }

    public toJson(): object {
        return {
            stops: this.stops.map(stop => stop.toJson())
        }
    }
}
