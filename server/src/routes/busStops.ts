import * as express from 'express';
import {Response} from '../models/response';
import {app, buses} from '../app';
import {BusArrival} from '../models/buses';

const router = express.Router();

router.get('/', (req, res) => {
    let responseData;
    try {
        res.status(200);
        responseData = Response.factory(true, app.locals.busStops.toJSON());
    } catch (e) {
        res.status(503);
        responseData = Response.factory(false, undefined, 503);
    } finally {
        res.json(responseData);
    }
});


router.get('/:busStopId', (req, res) => {
    let responseData;
    try {
        res.status(200);
        const busStopId = parseInt(req.params.busStopId);
        const busStop = app.locals.busStops.getBusStopWithId(busStopId);
        const arrivals: BusArrival[] = app.locals.buses.getExpectedArrivalsAtStop(busStop);
        let jsonBusStop = busStop.toJSON();

        let jsonArrivals = app.locals.busStops.arrivalsToJSON(arrivals);
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
        responseData = Response.factory(true, response);
    } catch (e) {
        res.status(503);
        responseData = Response.factory(false, undefined, 503);
    } finally {
        res.json(responseData);
    }
});

export default router;
