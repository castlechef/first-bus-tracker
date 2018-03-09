import * as express from 'express';
import * as bodyParser from 'body-parser';
import busesRoute from './routes/buses';
import busStopsRoute from './routes/busStops';
import {Buses} from './models/buses';
import {BusRouteName, BusStops} from './models/busStops';
import {IBusStop} from './models/busStop';

export const app = express();

export const buses = new Buses();

const data: { busStops: IBusStop[] } = require('../data.json');
export const busStops = new BusStops(data.busStops);

app.locals.buses = buses;
app.locals.busStops = busStops;

app.use(bodyParser.json());

app.use('/buses', busesRoute);

app.use('/busStops', busStopsRoute);
