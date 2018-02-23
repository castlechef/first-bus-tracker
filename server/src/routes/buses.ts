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
        if (Location.validateLocation(location)) {
            const bus = buses.newBus(new Location(location));
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

router.put('/{busId}', (req, res) => {
    // check bus exists
    //
});


export default router;

