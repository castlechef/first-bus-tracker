"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BusStop {
    constructor(id, name, location, busRouteData) {
        this._id = id;
        this._name = name;
        this._location = location;
        this.busRoutePositions = busRouteData;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get location() {
        return this._location;
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
            busStopId: this._id,
            busStopName: this._name,
            location: this._location.toJSON(),
            routes: this.busRoutePositions
        };
    }
}
exports.BusStop = BusStop;
//# sourceMappingURL=busStop.js.map