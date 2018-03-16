"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const location_1 = require("./location");
class Bus {
    constructor(id, location, busRouteName) {
        if (typeof id !== 'number' || !(location instanceof location_1.Location))
            throw new Error('invalid parameter');
        this._id = id;
        this.locations = [];
        this.updateLocation(location);
        this.busRoute = busRouteName;
    }
    get id() {
        return this._id;
    }
    updateLocation(location) {
        if (!(location instanceof location_1.Location))
            throw new Error('invalid location');
        this.locations.push(location);
    }
    toJSON() {
        return {
            busId: this.id,
            location: this.getLatestLocation().toJSON(),
            routeName: this.busRoute
        };
    }
    getLatestLocation() {
        return this.locations[this.locations.length - 1];
    }
}
exports.Bus = Bus;
//# sourceMappingURL=bus.js.map