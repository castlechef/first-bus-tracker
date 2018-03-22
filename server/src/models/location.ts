import {JSONable} from './response';
import {BusStop} from './busStop';

export type ILocation = {
    latitude: number;
    longitude: number;
}

export class Location implements JSONable {
    public static readonly MAX_LATITUDE: number = 51.391178;
    public static readonly MIN_LATITUDE: number = 51.355208;
    public static readonly MAX_LONGITUDE: number = -2.310755;
    public static readonly MIN_LONGITUDE: number = -2.403184;

    constructor({latitude, longitude}: ILocation) {
        if (!Location.isValidLocation({latitude, longitude})) {
            throw new Error('Invalid ILocation parameter');
        }
        this._latitude = latitude;
        this._longitude = longitude;
    }

    private _latitude: number;
    private _longitude: number;

    get latitude(): number {
        return this._latitude;
    }

    get longitude(): number {
        return this._longitude;
    }

    public static isValidLocation(location: ILocation): boolean {
        if (!location) return false;
        const {latitude, longitude} = location;
        return Location.isValidLatitude(latitude) && Location.isValidLongitude(longitude);
    }

    private static isValidLatitude(l: number): boolean {
        if (!l) return false;
        if (typeof l !== 'number') return false;
        if (l > Location.MIN_LATITUDE && l < Location.MAX_LATITUDE) return true;
        return false;
    }

    private static isValidLongitude(l: number): boolean {
        if (!l) return false;
        if (typeof l !== 'number') return false;
        if (l > Location.MIN_LONGITUDE && l < Location.MAX_LONGITUDE) return true;
        return false;
    }

    public toJSON(): object {
        return {
            latitude: this._latitude,
            longitude: this._longitude
        };
    }

    public distanceFrom(otherLocation: Location): number {
        function toRadians(n: number): number { return n * Math.PI / 180; }
        const R = 6371e3;
        const theta1 = toRadians(this.latitude);
        const theta2 = toRadians(otherLocation.latitude);
        const deltaTheta = toRadians(otherLocation.latitude - this.latitude);
        const deltaLamda = toRadians(otherLocation.longitude - this.longitude);
        const a = (Math.sin(deltaTheta / 2) ** 2) + (Math.cos(theta1) * Math.cos(theta2) * (Math.sin(deltaLamda / 2) ** 2));
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public static distanceBetweenN(locations: Location[]) {
        let total = 0;
        for (let i = 0; i < locations.length - 1; i++) {
            total += locations[i].distanceFrom(locations[i + 1]);
        }
        return total;
    }

    public static nearestBusStopToLocation(location: Location, busStops: BusStop[]): BusStop {
        return busStops.reduce((t, e) => t = (t && location.distanceFrom(t.location) < location.distanceFrom(e.location)) ? t : e);
    }
}
