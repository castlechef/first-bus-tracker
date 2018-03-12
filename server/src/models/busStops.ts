import {BusStop, IBusStop} from './busStop';
import {JSONable} from './response';
import {Location} from './location';
import {IdGenerator} from '../utils/id';

export enum BusRouteName {
    U1_CITY = 'U1 City Centre',
    U1_OLDFIELD = 'U1 Oldfield Park',
    U1_ABBEY = 'U1 Bath Abbey',
    U1X = 'U1X',
    U2 = 'U2'
}

export class BusStops implements JSONable {
    private stops: BusStop[];

    constructor(stops: IBusStop[]) {
        this.stops = BusStops.buildBusStopListFromPOJOs(stops);
    }

    private static buildBusStopListFromPOJOs(stopsData: IBusStop[]): BusStop[] {
        const idGenerator: IdGenerator = new IdGenerator();
        const busStops = [];
        stopsData.forEach(data => {
            busStops.push(new BusStop(idGenerator.getNextId(), data.busStopName, new Location(data.location), data.routes));
        });
        return busStops;
    }

    public getStopsWithRoutes(busRouteNames: BusRouteName[]): BusStop[] {
        return this.stops
            .filter(stop => {
                return busRouteNames
                    .some(e => stop.hasRoute(e));
            })
            .sort((s1, s2) => s1.name > s2.name ? 1 : -1);
    }

    public getStopsWithRoute(busRouteName: BusRouteName): BusStop[] {
        return this.stops
            .filter(stop => stop.hasRoute(busRouteName))
            .sort((s1, s2) => s1.getPositionOfRoute(busRouteName) - s2.getPositionOfRoute(busRouteName));
    }

    public toJSON(): object {
        return this.stops.map(stop => stop.toJSON())
    }
}

//export const busStops: BusStops = new BusStops(data.busStops);
