"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const busStop_1 = require("./busStop");
const location_1 = require("./location");
const id_1 = require("../utils/id");
var BusRouteName;
(function (BusRouteName) {
    BusRouteName["U1_CITY"] = "U1 City Centre";
    BusRouteName["U1_OLDFIELD"] = "U1 Oldfield Park";
    BusRouteName["U1_ABBEY"] = "U1 Bath Abbey";
    BusRouteName["U1X"] = "U1X";
    BusRouteName["U2"] = "U2";
})(BusRouteName = exports.BusRouteName || (exports.BusRouteName = {}));
class BusStops {
    constructor(stops) {
        this.stops = BusStops.buildBusStopListFromPOJOs(stops);
    }
    static buildBusStopListFromPOJOs(stopsData) {
        const idGenerator = new id_1.IdGenerator();
        const busStops = [];
        stopsData.forEach(data => {
            busStops.push(new busStop_1.BusStop(idGenerator.getNextId(), data.busStopName, new location_1.Location(data.location), data.routes));
        });
        return busStops;
    }
    getStopsWithRoutes(busRouteNames) {
        return this.stops
            .filter(stop => {
            return busRouteNames
                .some(e => stop.hasRoute(e));
        })
            .sort((s1, s2) => s1.name > s2.name ? 1 : -1);
    }
    getStopsWithRoute(busRouteName) {
        return this.stops
            .filter(stop => stop.hasRoute(busRouteName))
            .sort((s1, s2) => s1.getPositionOfRoute(busRouteName) - s2.getPositionOfRoute(busRouteName));
    }
    toJSON() {
        return this.stops.map(stop => stop.toJSON());
    }
}
exports.BusStops = BusStops;
//export const busStops: BusStops = new BusStops(data.busStops);
//# sourceMappingURL=busStops.js.map