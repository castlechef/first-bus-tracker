"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var locations = require("./routes/buses");
var buses_1 = require("./models/buses");
exports.app = express();
exports.buses = new buses_1.Buses();
exports.app.locals.buses = exports.buses;
exports.app.use(bodyParser.json());
exports.app.use('/buses', locations);
exports.app.get('/hey', function (req, res) {
    res.json({ hello: 'world' });
});
var currentId = 1;
function getNextId() {
    return currentId++;
}
exports.app.post('/location', function (req, res) {
    var responseData = req.body;
    responseData.data.busId = getNextId();
    res.json(responseData);
});
