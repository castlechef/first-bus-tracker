import {Location} from './location';
import {JSONable} from './response';
import {BusRouteName} from './busStops';
import {BusStop} from './busStop';

export type busId = number;

export type BusStopArrival = {
    busStop: BusStop;
    arrivalTime: number; // arrival unix time stamp
}

export type BusStopDeparture = {
    busStop: BusStop;
    departureTime: number; // departure unix time stamp
}

export class Bus implements JSONable {
    private static proximityToStopAtStop: number = 10; // in metres
    private static busSpeed: number = 4.2; // in metres per second
    private _id: busId;
    private locations: Location[];
    private _busRoute: BusRouteName;
    private busStops: BusStop[];
    private nextBusStop: BusStop;
    private establishedRoutePosition: boolean;
    private visitedBusStops: BusStop[];
    private busStopDepartureTimes: BusStopDeparture[];
    private busStopArrivalTimes: BusStopArrival[];

    constructor(id: busId, location: Location, busRouteName: BusRouteName, busStops: BusStop[]) {
        if (typeof id !== 'number' || !(location instanceof Location)) throw new Error('invalid parameter');
        this._id = id;
        this.locations = [];
        this._busRoute = busRouteName;
        this.busStops = busStops;
        this.establishedRoutePosition = false;
        this.visitedBusStops = [];
        this.busStopDepartureTimes = [];
        this.busStopArrivalTimes = [];
        this.updateLocation(location);
    }

    private establishRoutePosition(): void {
        const stopsInRange = this.getStopsWithinRange(Bus.proximityToStopAtStop);
        stopsInRange.forEach(s => {
            if (!this.visitedBusStops.includes(s)) {
                this.visitedBusStops.push(s);
            }
        });
        if (this.visitedBusStops.length < 2) return;

        for (let i = 0; i<this.visitedBusStops.length - 1; i++) {
            for (let j = i + 1; j<this.visitedBusStops.length; j++) {
                const positionJ = this.visitedBusStops[j].getPositionOfRoute(this._busRoute);
                const positionI = this.visitedBusStops[i].getPositionOfRoute(this._busRoute);
                if (positionJ === positionI + 1) {
                    this.nextBusStop = this.getBusStopAfterStop(this.visitedBusStops[j]);
                    this.establishedRoutePosition = !this.establishedRoutePosition;
                    this.updateBusStopArrivalTimes();
                }
            }
        }
    }

    private enforceBusRoutePositionEstablished(): void {
        if (!this.establishedRoutePosition) throw new Error ('Bus route position not established');
    }

    private ensureBusStopIsInRoute(busStop: BusStop): void {
        if (!this.stopsAt(busStop)) throw new Error('Bus stop not on route');
    }

    private stopsAt(busStop: BusStop): boolean {
        return this.busStops.includes(busStop);
    }

    private getLatestLocation() {
        return this.locations[this.locations.length - 1];
    }

    get id(): busId {
        return this._id;
    }

    get busRoute(): BusRouteName {
        return this._busRoute;
    }

    public hasStopPredictionReadyForStop(busStop: BusStop): boolean {
        return this.stopsAt(busStop) && this.establishedRoutePosition;
    }

    public updateLocation(location: Location): void {
        if (!(location instanceof Location)) throw new Error('invalid location');
        this.locations.push(location);

        if (!this.establishedRoutePosition) {
            this.establishRoutePosition();
        } else {
            let currentTime = Date.now(); // Date in unix time.

            if (this.getDistanceToStop(this.getNextBusStop()) <= Bus.proximityToStopAtStop) {
                this.busStopDepartureTimes.push({busStop: this.nextBusStop, departureTime: currentTime});
                this.nextBusStop = this.getBusStopAfterStop(this.nextBusStop);
            }
            this.updateBusStopArrivalTimes();
        }
    }

    private updateBusStopArrivalTimes() {
        let currentTime = Date.now(); // Date in unix time.
        this.busStopArrivalTimes = this.busStops.map(s => {return{busStop: s, arrivalTime: currentTime + (this.getDistanceToStop(s) / (Bus.busSpeed / 1000))}});
    }

    public getPredictedArrival(busStop: BusStop): number {
        this.enforceBusRoutePositionEstablished();
        this.ensureBusStopIsInRoute(busStop);
        return this.busStopArrivalTimes.reduce((t, e) => t = (e.busStop === busStop) ? e : t).arrivalTime;
    }

    public getNextBusStop(): BusStop {
        return this.nextBusStop;
    }

    public getBusStopAfterStop(busStop: BusStop): BusStop {
        this.ensureBusStopIsInRoute(busStop);

        const index = this.busStops.indexOf(busStop);
        const position = (index + 1) % this.busStops.length;
        return this.busStops[position];
    }

    public getNumberOfStopsUntilStop(busStop: BusStop): number {
        this.enforceBusRoutePositionEstablished();
        this.ensureBusStopIsInRoute(busStop);
        let ithBusStop = this.nextBusStop;
        let i = 1;
        while (ithBusStop !== busStop) {

            ithBusStop = this.getBusStopAfterStop(ithBusStop);
            i++;
        }
        return i;
    }

    public getDistanceToStop(busStop: BusStop): number {
        this.enforceBusRoutePositionEstablished();
        this.ensureBusStopIsInRoute(busStop);
        let distance = this.getLatestLocation().distanceFrom(this.nextBusStop.location);
        let ithBusStop = this.nextBusStop;
        while (ithBusStop !== busStop) {
            const iPlusOnethButStop = this.getBusStopAfterStop(ithBusStop);
            let newDist = ithBusStop.location.distanceFrom(iPlusOnethButStop.location);
            distance += newDist;
            ithBusStop = iPlusOnethButStop;
        }
        return distance;
    }

    public getDistanceToNearestStop(): number {
        return Location.distanceBetweenN([this.getLatestLocation(), this.getNearestStop().location]);
    }

    public getNearestStop(): BusStop {
        //return this.busStops.map(s => [this.getLatestLocation().distanceFrom(s.location), s]).reduce((t, e) => t = t[0] < e[0] ? t : e)[1];

        return this.busStops.map(s => [this.getLatestLocation().distanceFrom(s.location), s]).sort(([d1, _1], [d2, _2]) => d1 - d2)[0][1];
    }

    public getStopsWithinRange(range: number): BusStop[] {
        return this.busStops.filter(s => this.getLatestLocation().distanceFrom(s.location) <= range);
    }

    public toJSON(): object {
        return {
            busId: this.id,
            location: this.getLatestLocation().toJSON(),
            routeName: this._busRoute
        };
    }

}
