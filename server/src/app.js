"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const buses_1 = require("./routes/buses");
const busStops_1 = require("./routes/busStops");
const buses_2 = require("./models/buses");
const busStops_2 = require("./models/busStops");
const location_1 = require("./models/location");
const cors = require("cors");
const logger = require("morgan");
const corsOptions = {
    allowedHeaders: ["Origin"],
    credentials: true,
    methods: "GET,PUT,POST",
    origin: "*",
    preflightContinue: false
};
exports.app = express();
const data = require('../data.json');
exports.busStops = new busStops_2.BusStops(data.busStops);
location_1.Location.nearestBusStopToLocation(new location_1.Location({ latitude: 51.360800, longitude: -2.349803 }), exports.busStops.getStopsWithRoute(busStops_2.BusRouteName.U2));
exports.buses = new buses_2.Buses(exports.busStops);
exports.app.locals.buses = exports.buses;
exports.app.locals.busStops = exports.busStops;
exports.app.use(bodyParser.json());
exports.app.use(cors(corsOptions));
exports.app.use(logger('dev'));
exports.app.use('/buses', buses_1.default);
exports.app.use('/busStops', busStops_1.default);
//# sourceMappingURL=app.js.map