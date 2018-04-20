"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const buses_1 = require("./routes/buses");
const busStops_1 = require("./routes/busStops");
const busRoutes_1 = require("./routes/busRoutes");
const buses_2 = require("./models/buses");
const busStops_2 = require("./models/busStops");
const cors = require("cors");
const utils_1 = require("./utils/utils");
var RouteError = utils_1.Utils.routes.RouteError;
const moment = require("moment");
const corsOptions = {
    allowedHeaders: ['Origin'],
    credentials: true,
    methods: 'GET,PUT,POST',
    origin: '*',
    preflightContinue: true
};
exports.app = express();
const data = require('./data/busStops.json');
exports.busStops = new busStops_2.BusStops(data.busStops);
exports.buses = new buses_2.Buses(exports.busStops);
exports.app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // keep this if your api accepts cross-origin requests
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
    next();
});
exports.app.use('/api', (req, res, next) => {
    res.redirect(req.url.replace('/api', ''));
});
exports.app.locals.buses = exports.buses;
exports.app.locals.busStops = exports.busStops;
exports.app.use(bodyParser.json());
exports.app.use(cors(corsOptions));
//app.use(logger('dev'));
exports.app.use('/buses', buses_1.default);
exports.app.use('/busStops', busStops_1.default);
exports.app.use('/busRoutes', busRoutes_1.default);
exports.app.use('*', (err, req, res, next) => {
    if (err instanceof RouteError) {
        res.status(err.statusCode);
        res.json(err.getResponse());
    }
    else {
        next();
    }
});
setInterval((() => {
    const now = moment().unix() * 1000;
    const acceptableTime = now - (5 * 1000);
    exports.app.locals.buses.buses.forEach((bus) => {
        if (bus.latestMovementDate < acceptableTime) {
            console.log('removing old bus');
            exports.app.locals.buses.removeBus(bus.id);
        }
    });
}), 1000);
//# sourceMappingURL=app.js.map