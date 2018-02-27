import {Jsonable} from './response';

export type ILocation = {
    latitude: number;
    longitude: number;
}

export class Location implements Jsonable {
    public static readonly MAX_LATITUDE: number = 51.391178;
    public static readonly MIN_LATITUDE: number = 51.355208;
    public static readonly MAX_LONGITUDE: number = -2.310755;
    public static readonly MIN_LONGITUDE: number = -2.403184;

    private _latitude: number;
    private _longitude: number;

    public static isValidLocation({latitude, longitude}: ILocation): boolean {
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

    constructor({latitude, longitude}: ILocation) {
        if (!Location.isValidLocation({latitude, longitude}))
            throw new Error('Invalid ILocation parameter');
        this._latitude = latitude;
        this._longitude = longitude;
    }

    public toJson(): object {
        return {
            latitude: this._latitude,
            longitude: this._longitude
        };
    }

    get latitude(): number {
        return this._latitude;
    }

    get longitude(): number {
        return this._longitude;
    }
}
