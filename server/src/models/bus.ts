import {Location} from './location';
import {JSONable} from './response';
import {BusRouteName} from './busStops';
import {BusStop} from './busStop';

export type busId = number;

export class Bus implements JSONable {
    private locations: Location[];
    private busRoute: BusRouteName;

    constructor(id: busId, location: Location, busRouteName: BusRouteName) {
        if (typeof id !== 'number' || !(location instanceof Location)) throw new Error('invalid parameter');
        this._id = id;
        this.locations = [];
        this.updateLocation(location);
        this.busRoute = busRouteName;
    }

    private _id: busId;

    get id(): busId {
        return this._id;
    }

    public updateLocation(location: Location): void {
        if (!(location instanceof Location)) throw new Error('invalid location');
        this.locations.push(location);
    }

    public toJSON(): object {
        return {
            busId: this.id,
            location: this.getLatestLocation().toJSON(),
            routeName: this.busRoute
        };
    }

    private getLatestLocation() {
        return this.locations[this.locations.length - 1];
    }

}
