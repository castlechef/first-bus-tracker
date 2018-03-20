"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const response_1 = require("../models/response");
const app_1 = require("../app");
const router = express.Router();
router.get('/', (req, res) => {
    let responseData;
    try {
        res.status(200);
        responseData = response_1.Response.factory(true, app_1.app.locals.busStops.toJSON());
    }
    catch (e) {
        res.status(503);
        responseData = response_1.Response.factory(false, undefined, 503);
    }
    finally {
        res.json(responseData);
    }
});
router.get('/:busStopId', (req, res) => {
    let responseData;
    try {
        res.status(200);
        const busStopId = parseInt(req.params.busStopId);
        const busStop = app_1.app.locals.busStops.getBusStopWithId(busStopId);
        const arrivals = app_1.app.locals.buses.getExpectedArrivalsAtStop(busStop);
        let jsonBusStop = busStop.toJSON();
        let jsonArrivals = app_1.app.locals.busStops.arrivalsToJSON(arrivals);
        let response = {
            busStopId,
            busStopName: jsonBusStop.busStopName,
            location: jsonBusStop.location,
            arrivals: jsonArrivals
        };
        /*
        ""busStopId": 1,
                "busStopName": "Junction Road",
                "location": {
                    "latitude": 52.3456546,
                    "longitude": -1.3465544
                },
                "arrivals": [
                    {
                        "busId": 1,
                        "routeName": "U1",
                        "arrivalTime": "09:50"
                    },
                    {
                        "busId": 2,
                        "routeName": "U1X",
                        "arrivalTime": "09:53"
                    }
                ]*/
        responseData = response_1.Response.factory(true, response);
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
//# sourceMappingURL=busStops.js.map