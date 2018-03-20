import {BusStop, IBusStop} from './busStop';
import {JSONable} from './response';
import {Location} from './location';
import {IdGenerator} from '../utils/id';
import {Utils} from '../utils/utils';
import zip = Utils.arrays.zip;
import {BusArrival} from './buses';
import convertUnixTimeToNiceTime = Utils.time.convertUnixTimeToNiceTime;

export enum BusRouteName {
    U1_CITY = 'U1 City Centre',
    U1_OLDFIELD = 'U1 Oldfield Park',
    U1_ABBEY = 'U1 Bath Abbey',
    U1X = 'U1X',
    U1 = 'U1',
    U2 = 'U2'
}

export class BusStops implements JSONable {
    private stops: BusStop[];

    constructor(stops: IBusStop[]) {
        this.stops = BusStops.buildBusStopListFromPOJOs(stops);
    }

    private static buildBusStopListFromPOJOs(stopsData: IBusStop[]): BusStop[] {
        const idGenerator: IdGenerator = new IdGenerator();
        const busStops: BusStop[] = [];

        stopsData.forEach(data => {
            busStops.push(new BusStop(idGenerator.getNextId(), data.busStopName, new Location(data.location), data.routes));
        });

        //if (BusStops.busRoutesAreIncomplete(busStops)) throw new Error('bustops list must contain consistent positions for each route');

        try {
            BusStops.checkRoutesAreValid(busStops);
        } catch (e) {
            let m = 'Invalid config.\n' + e.reduce((t, e) => t += '\n' + e.message);
            throw new Error(m);
        }

        return busStops;
    }

    private static checkRoutesAreValid(busStops: BusStop[]) {
        let errors: Array<Error> | Error[] = [];
        for (let prop in BusRouteName) {
            const route: BusRouteName = BusRouteName[prop] as BusRouteName;

            const busStopsWithRoute = BusStops.getSortedRoute(busStops, route);
            BusStops.checkStopsAreValid(busStopsWithRoute, route).forEach(e => errors.push(e));
        }
        if (errors.length > 0) throw errors;
    }

    private static checkStopsAreValid(busStops: BusStop[], route: BusRouteName): Error[] {
        let errors: Error[] = [];
        if (busStops[0] && busStops[0].getPositionOfRoute(route) !== 1)
            errors.push(new Error(`Bus route ${route} does not have a first stop`));
        for (let i = 0; i < busStops.length - 1; i++) {
            /*const position = busStops[i].getPositionOfRoute(route);
            if (position !== i + 1) {
                errors.push(new Error(`Bus route ${route} stop ${position} (${busStops[i].name}) does not follow`));
            }*/
            const [position1, position2] = [busStops[i].getPositionOfRoute(route), busStops[i + 1].getPositionOfRoute(route)];

            if (position1 + 1 !== position2)
                errors.push(new Error(`Bus route ${route} stop ${position2} (${busStops[i + 1].name}) does not follow from ${position1} (${busStops[i].name})`))

        }
        return errors;
    }

    private static busRoutesAreIncomplete(busStops: BusStop[]): boolean {
        return Object.entries(BusRouteName).some(([_, route]) => {
            const routeStops = BusStops.getSortedRoute(busStops, route);
            return BusStops.busRouteIsIncomplete(routeStops, route);
        });
    }

    private static busRouteIsIncomplete(busStopsWithRoute: BusStop[], route: BusRouteName): boolean {
        if (positionOfFirstStopIsNotOne()) return true;
        const positions = busStopsWithRoute.map(s => s.getPositionOfRoute(route));
        return zip(positions, positions.slice(1)).some(([x, y]) => x + 1 !== y);

        function positionOfFirstStopIsNotOne() {
            return busStopsWithRoute[0] && busStopsWithRoute[0].getPositionOfRoute(route) !== 1;
        }
    }

    public static getSortedRoute(busStops: BusStop[], route: BusRouteName) {
        return busStops
            .filter(s => s.hasRoute(route))
            .sort((s1, s2) => s1.getPositionOfRoute(route) - s2.getPositionOfRoute(route));
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

    public getBusStopWithId(id: number): BusStop {
        if (!this.containsBusStopWithId(id)) throw new Error('Bus with id does not exist');
        return this.stops.filter(stop => stop.id === id)[0];
    }

    private containsBusStopWithId(id: number): boolean {
        return this.stops.filter(stop => stop.id === id).length === 1;
    }

    public arrivalsToJSON(arrivals: BusArrival[]): object {
        return arrivals.map( arrival => {return {busId: arrival.bus.id, routeName: arrival.bus.busRoute, arrivalTime: convertUnixTimeToNiceTime(arrival.arrivalTime)}});
    }

    public toJSON(): object {
        return this.stops.map(stop => stop.toJSON());
    }
}

