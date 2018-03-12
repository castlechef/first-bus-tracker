"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bus_1 = require("./bus");
const location_1 = require("./location");
const id_1 = require("../utils/id");
const busStops_1 = require("./busStops");
class Buses {
    constructor() {
        this.busMap = new Map();
        this.idGenerator = new id_1.IdGenerator();
    }
    containsBus(id) {
        return this.busMap.has(id);
    }
    getBus(id) {
        const bus = this.busMap.get(id);
        if (!bus)
            throw new Error('Bus not found');
        return bus;
    }
    createAndInsertBus(location, route) {
        if (!location_1.Location.isValidLocation(location) || !Buses.isValidBusRouteName(route))
            throw new Error('Invalid bus');
        const id = this.idGenerator.getNextId();
        const bus = new bus_1.Bus(id, location, route);
        this.busMap.set(id, bus);
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
        this.busMap.delete(id);
    }
    removeAllBuses() {
        this.idGenerator.resetIds();
        this.busMap.clear();
    }
    toJSON() {
        const jsonList = [];
        this.busMap.forEach(bus => jsonList.push(bus.toJSON()));
        return jsonList;
    }
}
exports.Buses = Buses;
//# sourceMappingURL=buses.js.map