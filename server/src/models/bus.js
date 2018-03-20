"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const location_1 = require("./location");
class Bus {
    constructor(id, location, busRouteName, busStops) {
        if (typeof id !== 'number' || !(location instanceof location_1.Location))
            throw new Error('invalid parameter');
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
    establishRoutePosition() {
        const stopsInRange = this.getStopsWithinRange(Bus.proximityToStopAtStop);
        stopsInRange.forEach(s => {
            if (!this.visitedBusStops.includes(s)) {
                this.visitedBusStops.push(s);
            }
        });
        if (this.visitedBusStops.length < 2)
            return;
        for (let i = 0; i < this.visitedBusStops.length - 1; i++) {
            for (let j = i + 1; j < this.visitedBusStops.length; j++) {
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
    enforceBusRoutePositionEstablished() {
        if (!this.establishedRoutePosition)
            throw new Error('Bus route position not established');
    }
    ensureBusStopIsInRoute(busStop) {
        if (!this.stopsAt(busStop))
            throw new Error('Bus stop not on route');
    }
    stopsAt(busStop) {
        return this.busStops.includes(busStop);
    }
    getLatestLocation() {
        return this.locations[this.locations.length - 1];
    }
    get id() {
        return this._id;
    }
    get busRoute() {
        return this._busRoute;
    }
    hasStopPredictionReadyForStop(busStop) {
        return this.stopsAt(busStop) && this.establishedRoutePosition;
    }
    updateLocation(location) {
        if (!(location instanceof location_1.Location))
            throw new Error('invalid location');
        this.locations.push(location);
        if (!this.establishedRoutePosition) {
            this.establishRoutePosition();
        }
        else {
            let currentTime = Date.now(); // Date in unix time.
            if (this.getDistanceToStop(this.getNextBusStop()) <= Bus.proximityToStopAtStop) {
                this.busStopDepartureTimes.push({ busStop: this.nextBusStop, departureTime: currentTime });
                this.nextBusStop = this.getBusStopAfterStop(this.nextBusStop);
            }
            this.updateBusStopArrivalTimes();
        }
    }
    updateBusStopArrivalTimes() {
        let currentTime = Date.now(); // Date in unix time.
        this.busStopArrivalTimes = this.busStops.map(s => { return { busStop: s, arrivalTime: currentTime + (this.getDistanceToStop(s) / (Bus.busSpeed / 1000)) }; });
    }
    getPredictedArrival(busStop) {
        this.enforceBusRoutePositionEstablished();
        this.ensureBusStopIsInRoute(busStop);
        return this.busStopArrivalTimes.reduce((t, e) => t = (e.busStop === busStop) ? e : t).arrivalTime;
    }
    getNextBusStop() {
        return this.nextBusStop;
    }
    getBusStopAfterStop(busStop) {
        this.ensureBusStopIsInRoute(busStop);
        const index = this.busStops.indexOf(busStop);
        const position = (index + 1) % this.busStops.length;
        return this.busStops[position];
    }
    getNumberOfStopsUntilStop(busStop) {
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
    getDistanceToStop(busStop) {
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
    getDistanceToNearestStop() {
        return location_1.Location.distanceBetweenN([this.getLatestLocation(), this.getNearestStop().location]);
    }
    getNearestStop() {
        //return this.busStops.map(s => [this.getLatestLocation().distanceFrom(s.location), s]).reduce((t, e) => t = t[0] < e[0] ? t : e)[1];
        return this.busStops.map(s => [this.getLatestLocation().distanceFrom(s.location), s]).sort(([d1, _1], [d2, _2]) => d1 - d2)[0][1];
    }
    getStopsWithinRange(range) {
        return this.busStops.filter(s => this.getLatestLocation().distanceFrom(s.location) <= range);
    }
    toJSON() {
        return {
            busId: this.id,
            location: this.getLatestLocation().toJSON(),
            routeName: this._busRoute
        };
    }
}
Bus.proximityToStopAtStop = 10; // in metres
Bus.busSpeed = 4.2; // in metres per second
exports.Bus = Bus;
//# sourceMappingURL=bus.js.map