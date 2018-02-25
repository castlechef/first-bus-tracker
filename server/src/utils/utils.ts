import {ILocation, Location} from '../models/location';

export namespace Utils {
    export namespace Numeric {
        export function randomBetweenNumbers(min: number, max: number): number {
            const r = (Math.random() * (max - min)) + min;
            return (r === min) ? this.randomBetweenNumbers(min, max) : r;
        }
    }

    export namespace location {
        export function generateValidLocation(): ILocation {
            const latitude = Numeric.randomBetweenNumbers(Location.MIN_LATITUDE, Location.MAX_LATITUDE);
            const longitude = Numeric.randomBetweenNumbers(Location.MIN_LONGITUDE, Location.MAX_LONGITUDE);
            return {
                latitude,
                longitude
            };
        }

        export function generateValidLocations(length): ILocation[] {
            return Array.from({length}, generateValidLocation);
        }
    }
}
