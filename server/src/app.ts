import * as express from 'express';
import * as bodyParser from 'body-parser';
import busesRoute from './routes/buses';
import {Buses} from './models/buses';

export const app = express();

export const buses = new Buses();

app.locals.buses = buses;

app.use(bodyParser.json());

app.use('/buses', busesRoute);

app.get('/hey', (req, res) => {
    res.json({hello: 'world'});
});

let currentId = 1;

function getNextId(): number {
    return currentId++;
}

app.post('/location', (req, res) => {

    const responseData = req.body;
    responseData.data.busId = getNextId();

    res.json(responseData);
});
