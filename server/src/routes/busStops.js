"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const response_1 = require("../models/response");
const app_1 = require("../app");
const utils_1 = require("../utils/utils");
var RouteError = utils_1.Utils.routes.RouteError;
const router = express.Router();
router.get('/', (req, res, next) => {
    try {
        res.status(200);
        const responseData = response_1.Response.factory(app_1.app.locals.busStops.toJSON());
        res.json(responseData);
    }
    catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});
router.get('/:busStopId', (req, res, next) => {
    try {
        res.status(200);
        const busStopId = parseInt(req.params.busStopId);
        const busStop = app_1.app.locals.busStops.getBusStopWithId(busStopId);
        const arrivals = app_1.app.locals.buses.getExpectedArrivalsAtStop(busStop);
        const jsonBusStop = busStop.toJSON();
        const jsonArrivals = app_1.app.locals.busStops.arrivalsToJSON(arrivals);
        const response = {
            busStopId,
            busStopName: jsonBusStop.busStopName,
            location: jsonBusStop.location,
            arrivals: jsonArrivals
        };
        const responseData = response_1.Response.factory(response);
        res.json(responseData);
    }
    catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});
exports.default = router;
//# sourceMappingURL=busStops.js.map