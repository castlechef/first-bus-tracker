import {Location} from './location';
import {Jsonable} from './response';

export class Bus implements Jsonable {
    private _id: number;
    private location: Location;

    constructor(id: number, location: Location) {
        this._id = id;
        this.location = location;
    }

    public updateLocation(location: Location): void {
        this.location = location;
    }

    get id(): number {
        return this._id;
    }

    public toJson(): object {
        return {
            busId: this.id,
            location: this.location.toJson()
        };
    }

}
