"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var buses_1 = require("./routes/buses");
var buses_2 = require("./models/buses");
exports.app = express();
exports.buses = new buses_2.Buses();
exports.app.locals.buses = exports.buses;
exports.app.use(bodyParser.json());
exports.app.use('/buses', buses_1.default);
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
