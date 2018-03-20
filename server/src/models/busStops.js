"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const busStop_1 = require("./busStop");
const location_1 = require("./location");
const id_1 = require("../utils/id");
const utils_1 = require("../utils/utils");
var zip = utils_1.Utils.arrays.zip;
var BusRouteName;
(function (BusRouteName) {
    BusRouteName["U1_CITY"] = "U1 City Centre";
    BusRouteName["U1_OLDFIELD"] = "U1 Oldfield Park";
    BusRouteName["U1_ABBEY"] = "U1 Bath Abbey";
    BusRouteName["U1X"] = "U1X";
    BusRouteName["U1"] = "U1";
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
        //if (BusStops.busRoutesAreIncomplete(busStops)) throw new Error('bustops list must contain consistent positions for each route');
        try {
            BusStops.checkRoutesAreValid(busStops);
        }
        catch (e) {
            let m = 'Invalid config.\n' + e.reduce((t, e) => t += '\n' + e.message);
            throw new Error(m);
        }
        return busStops;
    }
    static checkRoutesAreValid(busStops) {
        let errors = [];
        for (let prop in BusRouteName) {
            const route = BusRouteName[prop];
            const busStopsWithRoute = BusStops.getSortedRoute(busStops, route);
            BusStops.checkStopsAreValid(busStopsWithRoute, route).forEach(e => errors.push(e));
        }
        if (errors.length > 0)
            throw errors;
    }
    static checkStopsAreValid(busStops, route) {
        let errors = [];
        if (busStops[0] && busStops[0].getPositionOfRoute(route) !== 1)
            errors.push(new Error(`Bus route ${route} does not have a first stop`));
        for (let i = 0; i < busStops.length - 1; i++) {
            /*const position = busStops[i].getPositionOfRoute(route);
            if (position !== i + 1) {
                errors.push(new Error(`Bus route ${route} stop ${position} (${busStops[i].name}) does not follow`));
            }*/
            const [position1, position2] = [busStops[i].getPositionOfRoute(route), busStops[i + 1].getPositionOfRoute(route)];
            if (position1 + 1 !== position2)
                errors.push(new Error(`Bus route ${route} stop ${position2} (${busStops[i + 1].name}) does not follow from ${position1} (${busStops[i].name})`));
        }
        return errors;
    }
    static busRoutesAreIncomplete(busStops) {
        return Object.entries(BusRouteName).some(([_, route]) => {
            const routeStops = BusStops.getSortedRoute(busStops, route);
            return BusStops.busRouteIsIncomplete(routeStops, route);
        });
    }
    static busRouteIsIncomplete(busStopsWithRoute, route) {
        if (positionOfFirstStopIsNotOne())
            return true;
        const positions = busStopsWithRoute.map(s => s.getPositionOfRoute(route));
        return zip(positions, positions.slice(1)).some(([x, y]) => x + 1 !== y);
        function positionOfFirstStopIsNotOne() {
            return busStopsWithRoute[0] && busStopsWithRoute[0].getPositionOfRoute(route) !== 1;
        }
    }
    static getSortedRoute(busStops, route) {
        return busStops
            .filter(s => s.hasRoute(route))
            .sort((s1, s2) => s1.getPositionOfRoute(route) - s2.getPositionOfRoute(route));
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
    getBusStopWithId(id) {
        if (!this.containsBusStopWithId(id))
            throw new Error('Bus with id does not exist');
        return this.stops.filter(stop => stop.id === id)[0];
    }
    containsBusStopWithId(id) {
        return this.stops.filter(stop => stop.id === id).length === 1;
    }
    arrivalsToJSON(arrivals) {
        function convertUnixTimeToNiceTime(unixTime) {
            const dateTime = new Date(unixTime);
            const hours = '0' + dateTime.getHours();
            const minutes = '0' + dateTime.getMinutes();
            return hours.substr(-2) + ':' + minutes.substr(-2);
        }
        return arrivals.map(arrival => { return { busId: arrival.bus.id, routeName: arrival.bus.busRoute, arrivalTime: convertUnixTimeToNiceTime(arrival.arrivalTime) }; });
    }
    toJSON() {
        return this.stops.map(stop => stop.toJSON());
    }
}
exports.BusStops = BusStops;
//# sourceMappingURL=busStops.js.map