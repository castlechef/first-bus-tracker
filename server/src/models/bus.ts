import {Location} from './location';
import {Jsonable} from './response';

export type busId = number;

export class Bus implements Jsonable {
    private _id: busId;
    private locations: Location[];

    constructor(id: busId, location: Location) {
        if (typeof id !== "number" || !(location instanceof Location)) throw new Error('invalid parameter');
        this._id = id;
        this.locations = [];
        this.updateLocation(location);
    }

    public updateLocation(location: Location): void {
        if (!(location instanceof Location)) throw new Error('invalid location');
        //this.location = location;
        this.locations.push(location);
    }

    private getLatestLocation() {
        return this.locations[this.locations.length - 1];
    }

    get id(): busId {
        return this._id;
    }

    public toJson(): object {
        return {
            busId: this.id,
            location: this.getLatestLocation().toJson()
        };
    }

}
