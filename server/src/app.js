"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const buses_1 = require("./routes/buses");
const busStops_1 = require("./routes/busStops");
const buses_2 = require("./models/buses");
const busStops_2 = require("./models/busStops");
const cors = require("cors");
const corsOptions = {
    allowedHeaders: ["Origin"],
    credentials: true,
    methods: "GET,PUT,POST",
    origin: "*",
    preflightContinue: false
};
exports.app = express();
exports.buses = new buses_2.Buses();
const data = require('../data.json');
exports.busStops = new busStops_2.BusStops(data.busStops);
exports.app.locals.buses = exports.buses;
exports.app.locals.busStops = exports.busStops;
exports.app.use(bodyParser.json());
exports.app.use(cors(corsOptions));
exports.app.use('/buses', buses_1.default);
exports.app.use('/busStops', busStops_1.default);
//# sourceMappingURL=app.js.map