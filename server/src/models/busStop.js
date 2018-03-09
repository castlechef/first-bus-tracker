"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BusStop {
    constructor(id, name, location, busRouteData) {
        this.id = id;
        this._name = name;
        this.location = location;
        this.busRoutePositions = busRouteData;
    }
    get name() {
        return this._name;
    }
    hasRoute(busRoute) {
        return this.busRoutePositions.some(pair => pair.name === busRoute);
    }
    getPositionOfRoute(busRoute) {
        if (!this.hasRoute(busRoute))
            throw new Error('Stop does not have route');
        return this.busRoutePositions.find(pair => pair.name === busRoute).position;
    }
    toJSON() {
        return {
            busStopId: this.id,
            busStopName: this._name,
            location: this.location.toJSON(),
            routes: this.busRoutePositions
        };
    }
}
exports.BusStop = BusStop;
//# sourceMappingURL=busStop.js.map