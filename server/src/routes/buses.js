"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const location_1 = require("../models/location");
const response_1 = require("../models/response");
const app_1 = require("../app");
const busStops_1 = require("../models/busStops");
const router = express.Router();
router.get('/', (req, res) => {
    let responseData;
    try {
        res.status(200);
        responseData = response_1.Response.factory(true, app_1.buses.toJSON());
    }
    catch (e) {
        res.status(503);
        responseData = response_1.Response.factory(false, undefined, 503);
    }
    finally {
        res.json(responseData);
    }
});
router.post('/', (req, res) => {
    let responseData;
    try {
        const location = req.body.data.location;
        const route = req.body.data.routeName;
        if (location_1.Location.isValidLocation(location) && route in busStops_1.BusRouteName) {
            const bus = app_1.buses.createAndInsertBus(new location_1.Location(location), route);
            res.status(200);
            responseData = response_1.Response.factory(true, bus.toJSON());
        }
        else {
            res.status(422);
            responseData = response_1.Response.factory(false, location, 422);
        }
    }
    catch (e) {
        res.status(503);
        responseData = response_1.Response.factory(false, undefined, 503);
    }
    finally {
        res.json(responseData);
    }
});
router.get('/:busId', (req, res) => {
    const busId = parseInt(req.params.busId);
    let responseData;
    try {
        if (app_1.buses.containsBus(busId)) {
            const bus = app_1.buses.getBus(busId);
            responseData = response_1.Response.factory(true, bus.toDetailedJSON());
        }
        else {
            res.status(404);
            responseData = response_1.Response.factory(false, undefined, 404);
        }
    }
    catch (e) {
        res.status(503);
        responseData = response_1.Response.factory(false, undefined, 503);
    }
    finally {
        res.json(responseData);
    }
});
router.put('/:busId', (req, res) => {
    const busId = parseInt(req.params.busId);
    let responseData;
    const location = (req.body.data && req.body.data.location);
    try {
        if (app_1.buses.containsBus(busId)) {
            if (location_1.Location.isValidLocation(location)) {
                const bus = app_1.buses.getBus(busId);
                bus.updateLocation(new location_1.Location(location));
                res.status(200);
                responseData = response_1.Response.factory(true, bus.toJSON());
                console.log(bus.toDetailedJSON());
            }
            else {
                res.status(422);
                responseData = response_1.Response.factory(false, undefined, 422);
            }
        }
        else {
            res.status(404);
            const locationJSON = (location_1.Location.isValidLocation(location)) ? new location_1.Location(location).toJSON() : undefined;
            const data = {
                busId,
                location: locationJSON
            };
            responseData = response_1.Response.factory(false, data, 404);
        }
    }
    catch (e) {
        res.status(503);
        responseData = response_1.Response.factory(false, undefined, 503);
    }
    finally {
        res.json(responseData);
    }
});
exports.default = router;
//# sourceMappingURL=buses.js.map