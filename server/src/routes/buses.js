"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const location_1 = require("../models/location");
const response_1 = require("../models/response");
const app_1 = require("../app");
const busStops_1 = require("../models/busStops");
const utils_1 = require("../utils/utils");
var RouteError = utils_1.Utils.routes.RouteError;
const router = express.Router();
router.get('/', (req, res, next) => {
    try {
        res.status(200);
        const responseData = response_1.Response.factory(app_1.buses.toJSON());
        res.json(responseData);
    }
    catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});
router.post('/', (req, res, next) => {
    try {
        const location = req.body.data.location;
        const route = req.body.data.routeName;
        if (location_1.Location.isValidLocation(location) && route in busStops_1.BusRouteName) {
            const bus = app_1.buses.createAndInsertBus(new location_1.Location(location), route);
            res.status(200);
            const responseData = response_1.Response.factory(bus.toJSON());
            res.json(responseData);
        }
        else {
            next(RouteError.UnprocessableEntity(location));
        }
    }
    catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});
router.get('/:busId', (req, res, next) => {
    const busId = parseInt(req.params.busId);
    try {
        if (app_1.buses.containsBus(busId)) {
            const bus = app_1.buses.getBus(busId);
            const responseData = response_1.Response.factory(bus.toDetailedJSON());
            res.json(responseData);
        }
        else {
            next(RouteError.Notfound());
        }
    }
    catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});
router.put('/:busId/location', (req, res, next) => {
    const busId = parseInt(req.params.busId);
    let responseData;
    const location = (req.body.data && req.body.data.location);
    try {
        if (app_1.buses.containsBus(busId) && location_1.Location.isValidLocation(location)) {
            const bus = app_1.buses.getBus(busId);
            bus.updateLocation(new location_1.Location(location));
            res.status(200);
            responseData = response_1.Response.factory(bus.toJSON());
            res.json(responseData);
        }
        else if (location_1.Location.isValidLocation(location)) {
            const locationJSON = (location_1.Location.isValidLocation(location)) ? new location_1.Location(location).toJSON() : undefined;
            next(RouteError.Notfound({ busId, location: locationJSON }));
        }
        else {
            next(RouteError.UnprocessableEntity());
        }
    }
    catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});
exports.default = router;
//# sourceMappingURL=buses.js.map