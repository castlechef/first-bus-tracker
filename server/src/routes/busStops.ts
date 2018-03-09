import * as express from 'express';
import {Response} from '../models/response';
import {app} from '../app';

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

export default router;
