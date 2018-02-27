import * as express from 'express';
import * as bodyParser from 'body-parser';
import busesRoute from './routes/buses';
import {Buses} from './models/buses';

export const app = express();

export const buses = new Buses();

app.locals.buses = buses;

app.use(bodyParser.json());

app.use('/buses', busesRoute);

class A extends Error {

}
