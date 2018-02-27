import {Location} from './location';
import {Jsonable} from './response';

export type busId = number;

export class Bus implements Jsonable {
    private _id: busId;
    private location: Location;

    constructor(id: busId, location: Location) {
        if (typeof id !== "number" || !(location instanceof Location)) throw new Error('invalid parameter');
        this._id = id;
        this.location = location;
    }

    public updateLocation(location: Location): void {
        if (!(location instanceof Location)) throw new Error('invalid location');
        this.location = location;
    }

    get id(): busId {
        return this._id;
    }

    public toJson(): object {
        return {
            busId: this.id,
            location: this.location.toJson()
        };
    }

}
