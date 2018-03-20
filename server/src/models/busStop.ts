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
    private _id: number;
    private _name: string;
    private _location: Location;
    private busRoutePositions: BusRoutePosition[];

    constructor(id: number, name: string, location: Location, busRouteData: BusRoutePosition[]) {
        this._id = id;
        this._name = name;
        this._location = location;
        this.busRoutePositions = busRouteData;
    }


    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get location(): Location {
        return this._location;
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
            busStopId: this._id,
            busStopName: this._name,
            location: this._location.toJSON(),
            routes: this.busRoutePositions
        }
    }
}
