"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const location_1 = require("./location");
const utils_1 = require("../utils/utils");
var convertUnixTimeToNiceTime = utils_1.Utils.time.convertUnixTimeToNiceTime;
const busCapacity_1 = require("./busCapacity");
const buses_1 = require("./buses");
class Bus {
    constructor(id, location, busRouteName, busStops) {
        if (typeof id !== 'number' || !(location instanceof location_1.Location))
            throw new Error('invalid parameter');
        if (!buses_1.Buses.isValidBusRouteName(busRouteName))
            throw new Error();
        this._id = id;
        this.locations = [];
        this._busRoute = busRouteName;
        this.busStops = busStops;
        this.establishedRoutePosition = false;
        this.visitedBusStops = [];
        this.busStopDepartureTimes = [];
        this.busStopArrivalTimes = [];
        this.busCapacity = new busCapacity_1.BusCapacity();
        this.updateLocation(location);
    }
    establishRoutePosition() {
        const stopsInRange = this.getStopsWithinRange(Bus.PROXIMITY_TO_STOP_AT_STOP);
        stopsInRange.forEach(s => {
            if (!this.visitedBusStops.some(({ busStop }) => busStop === s)) {
                this.visitedBusStops.push({ busStop: s, departureTime: Date.now() });
            }
        });
        if (this.visitedBusStops.length < 2)
            return;
        for (let i = 0; i < this.visitedBusStops.length - 1; i++) {
            for (let j = i + 1; j < this.visitedBusStops.length; j++) {
                const positionJ = this.visitedBusStops[j].busStop.getPositionOfRoute(this._busRoute);
                const positionI = this.visitedBusStops[i].busStop.getPositionOfRoute(this._busRoute);
                if (positionJ === positionI + 1) {
                    // TODO Time Stamp and add to departure times
                    this.nextBusStop = this.getBusStopAfterStop(this.visitedBusStops[j].busStop);
                    this.establishedRoutePosition = !this.establishedRoutePosition;
                    this.busStopDepartureTimes.push(this.visitedBusStops[i]);
                    this.busStopDepartureTimes.push(this.visitedBusStops[j]);
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
            if (this.getDistanceToStop(this.getNextBusStop()) <= Bus.PROXIMITY_TO_STOP_AT_STOP) {
                this.busStopDepartureTimes.push({ busStop: this.nextBusStop, departureTime: currentTime });
                this.nextBusStop = this.getBusStopAfterStop(this.nextBusStop);
                this.busCapacity.resetAverage();
            }
            this.updateBusStopArrivalTimes();
        }
    }
    updateCapacity(capacity) {
        this.busCapacity.addValue(capacity);
    }
    updateBusStopArrivalTimes() {
        let currentTime = Date.now(); // Date in unix time.
        this.busStopArrivalTimes = this.busStops.map(s => {
            return { busStop: s, arrivalTime: currentTime + (this.getDistanceToStop(s) / (Bus.BUS_SPEED / 1000)) };
        });
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
            routeName: this.busRoute
        };
    }
    toDetailedJSON() {
        // busId, location, routeName, departureTimes (busStopId, busStopName, departureTime), arrivalTimes (busStopId, busStopName, arrivalTime)
        const departureTimes = this.busStopDepartureTimes
            .sort(({ busStop: busStop1, departureTime: t1 }, { busStop: busStop2, departureTime: t2 }) => {
            return t2 - t1;
        })
            .filter(({ busStop, departureTime }, index) => {
            return index < Bus.NUMBER_OF_DEPARTURE_TIMES_TO_SEND;
        })
            .map(({ busStop, departureTime }) => {
            return {
                busStopId: busStop.id,
                busStopsName: busStop.name,
                departureTime: convertUnixTimeToNiceTime(departureTime)
            };
        })
            .reverse();
        const arrivalTimes = this.busStopArrivalTimes
            .sort(({ busStop: busStop1, arrivalTime: t1 }, { busStop: busStop2, arrivalTime: t2 }) => t1 > t2 ? 1 : -1)
            .filter(({ busStop, arrivalTime }, index) => {
            return index < Bus.NUMBER_OF_ARRIVAL_TIMES_TO_SEND;
        })
            .map(({ busStop, arrivalTime }) => {
            return {
                busStopId: busStop.id,
                busStopsName: busStop.name,
                arrivalTime: convertUnixTimeToNiceTime(arrivalTime)
            };
        });
        return {
            busId: this.id,
            location: this.getLatestLocation().toJSON(),
            routeName: this.busRoute,
            capacity: this.busCapacity.toJSON(),
            departureTimes,
            arrivalTimes
        };
    }
}
Bus.NUMBER_OF_DEPARTURE_TIMES_TO_SEND = 2;
Bus.NUMBER_OF_ARRIVAL_TIMES_TO_SEND = 10;
Bus.PROXIMITY_TO_STOP_AT_STOP = 10; // in metres
Bus.BUS_SPEED = 4.2; // in metres per second
exports.Bus = Bus;
//# sourceMappingURL=bus.js.map