import {BusRouteName, BusStops} from '../models/busStops';
import {Utils} from '../utils/utils';
import {BusStop, IBusStop} from '../models/busStop';
import {Location} from '../models/location';
import * as rp from 'request-promise';
import randomBetweenNumbers = Utils.Numeric.randomBetweenNumbers;
import Timer = NodeJS.Timer;

export class BusBot {
    private routeName: BusRouteName;
    private routeStops: BusStop[];
    private nextBusStopIndex: number;
    private interval: Timer;
    private busId: number;
    private distancePerMove = 30; //metres
    private currentLocation: Location;
    private speed: number;
    private milliseconds: number;

    constructor(routeName: BusRouteName, mph: number | string, milliseconds: number) {
        if (typeof milliseconds === 'string') milliseconds = parseInt(milliseconds);
        this.milliseconds = milliseconds;
        this.speed = this.milesPerHourToMetersPerSecond(mph);
        this.routeName = routeName;
        const data: { busStops: IBusStop[] } = require('../data/busStops.json');
        const busStops = new BusStops(data.busStops);
        this.routeStops = busStops.getStopsWithRoute(routeName);
        if (this.routeStops.length < 2) throw new Error('Bus route must have at least 2 stops');
        this.nextBusStopIndex = Math.floor(randomBetweenNumbers(0, this.routeStops.length));
    }

    public async startFollowing(): Promise<void> {
        const nextLocation = this.getNextLocation();
        this.currentLocation = nextLocation;
        const options = {
            method: 'POST',
            uri: 'http://localhost:8080/buses',
            body: {
                data: {
                    location: nextLocation.toJSON(),
                    routeName: this.routeName
                }
            },
            json: true
        };
        try {
            const data = await rp(options);
            this.busId = data.data.busId;
            console.log('Post successful!');
            console.log(data.data);
        } catch (e) {
            console.log('Error!!', e.message);
            throw new Error('Cannot start following :(');
        }
    }

    public runPutRequestOnInterval(): void {
        if (this.interval) {
            console.log('Removing previous interval.');
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => {
            this.runPutRequest()
                .then(() => {
                    console.log('Interval put request success');
                })
                .catch(err => {
                    //console.log('Interval put request failure', err.message);
                });
        }, this.milliseconds);
    }

    public async runPutRequest(): Promise<void> {
        this.move();
        const options = {
            method: 'PUT',
            uri: `http://localhost:8080/buses/${this.busId}/location`,
            body: {
                data: {
                    location: this.currentLocation.toJSON()
                }
            },
            json: true
        };
        try {
            const data = await rp(options);
            console.log('Put successful!');
            console.log(data.data);
        } catch (e) {
            console.log('Error!!', e.message);
            throw new Error('Cannot PUT :(');
        }

    }

    private move(): void {
        let distanceToMove: number = (this.speed * this.milliseconds) / 1000;//this.distancePerMove;
        console.log('distanceToMove',distanceToMove);
        console.log(this.speed,this.milliseconds);
        let distanceToNextStop: number = this.peakNextLocation().distanceFrom(this.currentLocation);
        while (distanceToMove > distanceToNextStop) {
            distanceToMove -= distanceToNextStop;
            this.currentLocation = this.getNextLocation();
            distanceToNextStop = this.peakNextLocation().distanceFrom(this.currentLocation);
        }
        this.currentLocation = this.currentLocation.moveInDirectionOf(this.peakNextLocation(), distanceToMove);
    }

    private peakNextLocation(): Location {
        return this.routeStops[this.nextBusStopIndex].location;
    }

    private getNextLocation(): Location {
        const location: Location = this.peakNextLocation();
        this.nextBusStopIndex = (this.nextBusStopIndex + 1) % this.routeStops.length;
        return location;
    }

    public stopFollowing(): void {
        clearInterval(this.interval);
    }

    private milesPerHourToMetersPerSecond(mph) {
        return mph * 0.44704;
    }
}



function getOptionsFromArray(optionsArr: string[]): any {
    return optionsArr
        .filter(optionStr => /^--\S+=\S+$/g.test(optionStr))
        .map(optionStr => optionStr.replace('--', '').split('='))
        .reduce<any>((o, arr) => ({...o,[dashedToCamelCase(arr[0])]: dashedToSpaced(arr[1])}),{});
}

function dashedToCamelCase(dashed: string): string {
    if (!dashed.includes('-')) return dashed;
    let parts = dashed.split('-').filter(s => s.length > 0);
    return [parts.shift(), ...parts.map(s => s.replace(/^[a-z]/g, c => c.toUpperCase()))].join('');
}

function dashedToSpaced(dashed: string): string {
    return dashed.split('-').join(' ');
}

const {busRoute, interval = 1000, mph = '25'} = getOptionsFromArray(process.argv.slice(2));
console.log('mph', mph);

const b = new BusBot(busRoute, parseInt(mph), interval);
b.startFollowing().then(() => {
    setTimeout(() => {
        b.runPutRequestOnInterval();
    }, interval);
});