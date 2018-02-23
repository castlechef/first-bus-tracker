"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        var location_2 = req.body.data.location;
        if (location_1.Location.isValidLocation(location_2)) {
            var bus = app_1.buses.newBus(new location_1.Location(location_2));
            res.status(200);
            responseData = response_1.Response.factory(true, bus.toJson());
        }
        else {
            res.status(422);
            responseData = response_1.Response.factory(false, location_2, 422);
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
router.put('/{busId}', function (req, res) {
    // check bus exists
    //
});
exports.default = router;
