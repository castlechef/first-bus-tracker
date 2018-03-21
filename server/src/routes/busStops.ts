import * as express from 'express';
import {JsonResponse, Response} from '../models/response';
import {app} from '../app';
import {BusArrival} from '../models/buses';
import {Utils} from '../utils/utils';
import RouteError = Utils.routes.RouteError;

const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.status(200);
        const responseData: JsonResponse = Response.factory(app.locals.busStops.toJSON());
        res.json(responseData)
    }  catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});


router.get('/:busStopId', (req, res, next) => {
    try {
        res.status(200);
        const busStopId = parseInt(req.params.busStopId);
        const busStop = app.locals.busStops.getBusStopWithId(busStopId);
        const arrivals: BusArrival[] = app.locals.buses.getExpectedArrivalsAtStop(busStop);
        const jsonBusStop = busStop.toJSON();

        const jsonArrivals = app.locals.busStops.arrivalsToJSON(arrivals);
        const response = {
            busStopId,
            busStopName: jsonBusStop.busStopName,
            location: jsonBusStop.location,
            arrivals: jsonArrivals
        };
        const responseData: JsonResponse = Response.factory(response);
        res.json(responseData);
    } catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});

export default router;
