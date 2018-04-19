import {BusRouteName, BusStops} from '../models/busStops';
import {Utils} from '../utils/utils';
import {BusStop, IBusStop} from '../models/busStop';
import {Location} from '../models/location';
import * as rp from 'request-promise';
import randomBetweenNumbers = Utils.Numeric.randomBetweenNumbers;
import Timer = NodeJS.Timer;

export class BusBot {
    private routeName: BusRouteName;
    //private routeStops: BusStop[];
    private waypointIndex: number;
    private interval: Timer;
    private busId: number;
    private distancePerMove = 30; //metres
    private currentLocation: Location;
    private speed: number;
    private milliseconds: number;
    private waypoints: Location[];

    constructor(routeName: BusRouteName, mph: number | string, milliseconds: number) {
        if (typeof milliseconds === 'string') milliseconds = parseInt(milliseconds);
        this.milliseconds = milliseconds;
        this.speed = this.milesPerHourToMetersPerSecond(mph);
        this.routeName = routeName;
        const data: { busStops: IBusStop[] } = require('../data/busStops.json');
        const busStops = new BusStops(data.busStops);
        //this.routeStops = busStops.getStopsWithRoute(routeName);
        this.waypoints = this.getPointsOfRoute();
        //if (this.routeStops.length < 2) throw new Error('Bus route must have at least 2 stops');
        this.waypointIndex = Math.floor(randomBetweenNumbers(0, this.waypoints.length));
        console.log('Total route length: ' + Location.distanceBetweenN(this.waypoints));
    }

    private getPointsOfRoute(): Location[] {
        const {busRoutes, sections} = require('../data/busRoutes.json');
        if (!busRoutes.some(busRoute => busRoute.busRouteName === this.routeName)) throw new Error('Route not found');
        const busRoute = busRoutes.find(r => r.busRouteName === this.routeName);
        function getPositionsFromSectionId(id: number): Location[] {
            //console.log('getting positions from section id ' + id);
            if (id < 0) return getPositionsFromSectionId(-id).reverse();
            const section = sections.find(section => section.sectionId === id);
            //console.log(section);
            return section.positions.map(l => new Location(l));
        }

        let positionList = [];
        busRoute.order.forEach(id => {
            let points = getPositionsFromSectionId(id);
            points.forEach(point => positionList.push(point));
        });
        return positionList;
    }

    public async startFollowing(): Promise<void> {
        const nextLocation = this.getNextLocation();
        this.currentLocation = nextLocation;
        const options = {
            method: 'POST',
            uri: 'http://firstbustracker.ddns.net/api/buses',
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
            //console.log('Post successful!');
            //console.log(data.data);
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
            uri: `http://firstbustracker.ddns.net/api/buses/${this.busId}/location`,
            body: {
                data: {
                    location: this.currentLocation.toJSON()
                }
            },
            json: true
        };
        try {
            const data = await rp(options);
            //console.log('Put successful!');
            //console.log(data.data);
        } catch (e) {
            console.log('Error!!', e.message);
            throw new Error('Cannot PUT :(');
        }

    }

    private move(): void {
        let distanceToMove: number = (this.speed * this.milliseconds) / 1000;//this.distancePerMove;
        //console.log('distanceToMove',distanceToMove);
        //console.log(this.speed,this.milliseconds);
        let distanceToNextPosition: number = this.peakNextLocation().distanceFrom(this.currentLocation);
        while (distanceToMove > distanceToNextPosition) {
            distanceToMove -= distanceToNextPosition;
            this.currentLocation = this.getNextLocation();
            distanceToNextPosition = this.peakNextLocation().distanceFrom(this.currentLocation);
        }
        this.currentLocation = this.currentLocation.moveInDirectionOf(this.peakNextLocation(), distanceToMove);
    }

    private peakNextLocation(): Location {
        return this.waypoints[this.waypointIndex];
    }

    private getNextLocation(): Location {
        const location: Location = this.peakNextLocation();
        this.waypointIndex = (this.waypointIndex + 1) % this.waypoints.length;
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

const {busRoute, interval = 100, mph = '25'} = getOptionsFromArray(process.argv.slice(2));
console.log('mph', mph);

const b = new BusBot(busRoute, parseInt(mph), interval);
b.startFollowing().then(() => {
    setTimeout(() => {
        b.runPutRequestOnInterval();
    }, interval);
});