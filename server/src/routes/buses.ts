import * as express from 'express';
import {Location} from '../models/location';
import {JsonResponse, Response} from '../models/response';
import {buses} from '../app';
import {BusRouteName} from '../models/busStops';
import {Utils} from '../utils/utils';
import RouteError = Utils.routes.RouteError;

const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.status(200);
        const responseData: JsonResponse = Response.factory(buses.toJSON());
        res.json(responseData);
    } catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});

router.post('/', (req, res, next) => {
    try {
        const location = req.body.data.location;
        const route: BusRouteName = req.body.data.routeName;

        if (Location.isValidLocation(location) && route in BusRouteName) {
            const bus = buses.createAndInsertBus(new Location(location), route);
            res.status(200);
            const responseData: JsonResponse = Response.factory(bus.toJSON());
            res.json(responseData);
        } else {
            next(RouteError.UnprocessableEntity(location));
        }
    }  catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});

router.get('/:busId', (req, res, next) => {
    const busId = parseInt(req.params.busId);
    try {
        if (buses.containsBus(busId)) {
            const bus = buses.getBus(busId);
            const responseData: JsonResponse = Response.factory(bus.toDetailedJSON());
            res.json(responseData);
        } else {
            next(RouteError.Notfound());
        }
    } catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});

router.put('/:busId', (req, res, next) => {
    const busId = parseInt(req.params.busId);
    let responseData: JsonResponse;
    const location = (req.body.data && req.body.data.location);
    try {
        if (buses.containsBus(busId) && Location.isValidLocation(location)) {
            const bus = buses.getBus(busId);
            bus.updateLocation(new Location(location));
            res.status(200);
            responseData = Response.factory(bus.toJSON());
            res.json(responseData);
        } else if (Location.isValidLocation(location)) {
            const locationJSON = (Location.isValidLocation(location)) ? new Location(location).toJSON() : undefined;
            next(RouteError.Notfound({busId, location: locationJSON}));
        } else {
            next(RouteError.UnprocessableEntity());
        }
    } catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});

export default router;

