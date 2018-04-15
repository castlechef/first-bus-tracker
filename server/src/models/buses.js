"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bus_1 = require("./bus");
const location_1 = require("./location");
const id_1 = require("../utils/id");
const busStops_1 = require("./busStops");
class Buses {
    constructor(busStops) {
        if (!busStops)
            throw new Error('Creating Buses without a valid BusStops');
        //this.busMap = new Map<busId, Bus>();
        this.buses = [];
        this.idGenerator = new id_1.IdGenerator();
        this.busStops = busStops;
    }
    containsBus(id) {
        return this.buses.some(b => b.id === id);
        //return this.busMap.has(id);
    }
    getBus(id) {
        //const bus = this.busMap.get(id);
        const bus = this.buses.reduce((t, b) => t = (b.id === id) ? b : t, undefined);
        if (!bus)
            throw new Error('Bus not found');
        return bus;
    }
    createAndInsertBus(location, route) {
        if (!location_1.Location.isValidLocation(location) || !Buses.isValidBusRouteName(route))
            throw new Error('Invalid bus');
        const id = this.idGenerator.getNextId();
        const bus = new bus_1.Bus(id, location, route, this.busStops.getStopsWithRoute(route));
        //this.busMap.set(id, bus);
        this.buses.push(bus);
        return bus;
    }
    static isValidBusRouteName(route) {
        for (let thing in busStops_1.BusRouteName) {
            if (busStops_1.BusRouteName[thing] === route)
                return true;
        }
        return false;
    }
    removeBus(id) {
        if (!this.containsBus(id))
            throw new Error('bus not found');
        //this.busMap.delete(id);
        let bus = this.getBus(id);
        this.buses.splice(this.buses.indexOf(bus), 1);
    }
    removeAllBuses() {
        this.idGenerator.resetIds();
        //this.busMap.clear();
        this.buses = [];
    }
    getExpectedArrivalsAtStop(busStop) {
        let a = this.buses
            .filter(b => b.hasStopPredictionReadyForStop(busStop))
            .map(b => { return { bus: b, arrivalTime: b.getPredictedArrival(busStop) }; })
            .sort((b1, b2) => b1.arrivalTime > b2.arrivalTime ? 1 : -1);
        a.forEach(({ arrivalTime }) => console.log('arrival time: ' + arrivalTime));
        return a;
    }
    toJSON() {
        const jsonList = [];
        //this.busMap.forEach(bus => jsonList.push(bus.toJSON()));
        this.buses.forEach(bus => jsonList.push(bus.toJSON()));
        return jsonList;
    }
}
exports.Buses = Buses;
//# sourceMappingURL=buses.js.map