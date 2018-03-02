"use strict";
exports.__esModule = true;
var express = require("express");
var location_1 = require("../models/location");
var response_1 = require("../models/response");
var app_1 = require("../app");
var router = express.Router();
router.get('/', function (req, res) {
    var responseData;
    try {
        res.status(200);
        responseData = response_1.Response.factory(true, app_1.buses.toJson());
    }
    catch (e) {
        res.status(503);
        responseData = response_1.Response.factory(false, undefined, 503);
    }
    finally {
        res.json(responseData);
    }
});
router.post('/', function (req, res) {
    var responseData;
    try {
        var location = req.body.data.location;
        if (location_1.Location.isValidLocation(location)) {
            var bus = app_1.buses.createAndInsertBus(new location_1.Location(location));
            res.status(200);
            responseData = response_1.Response.factory(true, bus.toJson());
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
router.put('/:busId', function (req, res) {
    var busId = parseInt(req.params.busId);
    var responseData;
    var location = (req.body.data && req.body.data.location);
    try {
        if (app_1.buses.containsBus(busId)) {
            if (location_1.Location.isValidLocation(location)) {
                var bus = app_1.buses.getBus(busId);
                bus.updateLocation(new location_1.Location(location));
                res.status(200);
                responseData = response_1.Response.factory(true, bus.toJson());
            }
            else {
                res.status(422);
                responseData = response_1.Response.factory(false, undefined, 422);
            }
        }
        else {
            res.status(404);
            var data = {
                busId: busId
            };
            data.location = (location_1.Location.isValidLocation(location)) ? new location_1.Location(location).toJson() : undefined;
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
exports["default"] = router;
