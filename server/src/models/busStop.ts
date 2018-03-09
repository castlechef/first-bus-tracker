import {JSONable} from './response';
import {ILocation, Location} from './location';
import {BusRouteName} from './busStops';

export type IBusStop = {
    id?: number;
    busStopName: string;
    location: ILocation;
    routes: BusRoutePosition[];
}

export type BusRoutePosition = {
    name: BusRouteName;     //name of the route
    // TODO: update to multiple locations per route/stop.
    position: number;       //position in the route
}

export class BusStop implements JSONable {
    private id: number;
    private _name: string;
    private location: Location;
    private busRoutePositions: BusRoutePosition[];

    constructor(id: number, name: string, location: Location, busRouteData: BusRoutePosition[]) {
        this.id = id;
        this._name = name;
        this.location = location;
        this.busRoutePositions = busRouteData;
    }

    get name(): string {
        return this._name;
    }

    public hasRoute(busRoute: BusRouteName): boolean {
        return this.busRoutePositions.some(pair => pair.name === busRoute);
    }

    public getPositionOfRoute(busRoute: BusRouteName): number {
        if (!this.hasRoute(busRoute)) throw new Error('Stop does not have route');
        return this.busRoutePositions.find(pair => pair.name === busRoute).position;
    }

    public toJSON(): object {
        return {
            busStopId: this.id,
            busStopName: this._name,
            location: this.location.toJSON(),
            routes: this.busRoutePositions
        }
    }
}
