import * as express from 'express';
import {Location} from '../models/location';
import {JsonResponse, Response} from '../models/response';
import {buses} from '../app';

const router = express.Router();

router.get('/', (req, res) => {
    let responseData: JsonResponse;
    try {
        res.status(200);
        responseData = Response.factory(true, buses.toJson());
    } catch (e) {
        res.status(503);
        responseData = Response.factory(false, undefined, 503);
    } finally {
        res.json(responseData);
    }
});

router.post('/', (req, res) => {
    let responseData: JsonResponse;
    try {
        const location = req.body.data.location;
        if (Location.isValidLocation(location)) {
            const bus = buses.createAndInsertBus(new Location(location));
            res.status(200);
            responseData = Response.factory(true, bus.toJson());
        } else {
            res.status(422);
            responseData = Response.factory(false, location, 422);
        }
    } catch (e) {
        res.status(503);
        responseData = Response.factory(false, undefined, 503);
    } finally {
        res.json(responseData);
    }
});

router.put('/:busId', (req, res) => {
    const busId = parseInt(req.params.busId);
    let responseData: JsonResponse;
    const location = (req.body.data && req.body.data.location);
    try {
        if (buses.containsBus(busId)) {
            if (Location.isValidLocation(location)) {
                const bus = buses.getBus(busId);
                bus.updateLocation(new Location(location));
                res.status(200);
                responseData = Response.factory(true, bus.toJson());
            } else {
                res.status(422);
                responseData = Response.factory(false, undefined, 422);
            }
        } else {
            res.status(404);
            const data = {
                busId
            };
            data.location = (Location.isValidLocation(location)) ? new Location(location).toJson() : undefined;
            responseData = Response.factory(false, data, 404);
        }
    } catch (e) {
        res.status(503);
        responseData = Response.factory(false, undefined, 503);
    } finally {
        res.json(responseData);
    }
});


export default router;

