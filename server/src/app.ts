import * as express from 'express';
import * as bodyParser from 'body-parser';
import busesRoute from './routes/buses';
import busStopsRoute from './routes/busStops';
import busRoutes from './routes/busRoutes';
import {Buses} from './models/buses';
import {BusStops} from './models/busStops';
import {IBusStop} from './models/busStop';
import * as cors from 'cors';
import * as logger from 'morgan';
import {Utils} from './utils/utils';
import RouteError = Utils.routes.RouteError;

const corsOptions: cors.CorsOptions = {
    allowedHeaders: ['Origin'],
    credentials: true,
    methods: 'GET,PUT,POST',
    origin: '*',
    preflightContinue: true
};

export const app = express();

const data: { busStops: IBusStop[] } = require('./data/busStops.json');

export const busStops = new BusStops(data.busStops);
export const buses = new Buses(busStops);

app.locals.buses = buses;
app.locals.busStops = busStops;

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(logger('dev'));

app.use('/buses', busesRoute);
app.use('/busStops', busStopsRoute);
app.use('/busRoutes', busRoutes);
app.use('*', (err, req, res, next) => {
    if (err instanceof RouteError) {
        res.status(err.statusCode);
        res.json(err.getResponse());
    } else {
        next();
    }
});
