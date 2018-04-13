import * as express from 'express';
import {Utils} from '../utils/utils';
import RouteError = Utils.routes.RouteError;

const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        const data = require('../data/busRoutes.json');
        res.json({
            status: 'success',
            data
        });
    } catch(e) {
        next(RouteError.ServiceUnavailable());
    }
});

export default router;