"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
/**
 * to run this server on localhost install the chrome extension
 * https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi
 * otherwise it won't work when doing a get request
 */
let app = express();
const options = {
    allowedHeaders: ["Origin"],
    credentials: true,
    methods: "GET,PUT,POST",
    origin: "*",
    preflightContinue: false
};
app.use(cors(options));
app.get('/buses', (req, res) => {
    const testData = {
        'status': 'success',
        'data': [
            {
                'busId': 1,
                'location': {
                    'latitude': 53.003444,
                    'longitude': -2.273507
                },
                'routeName': 'U2'
            },
            {
                'busId': 2,
                'location': {
                    'latitude': 53.9643824,
                    'longitude': -2.295362
                },
                'routeName': 'U2'
            },
            {
                'busId': 3,
                'location': {
                    'latitude': 53.837285,
                    'longitude': -2.276247
                },
                'routeName': 'U1X'
            }
        ]
    };
    res.status(200);
    res.json(testData);
});
app.get('/busStops', (req, res) => {
    const testData = {
        "status": "success",
        "data": [
            {
                "busStopId": 1,
                "busStopName": "Junction Road",
                "location": {
                    "latitude": 52.35546,
                    "longitude": -1.3452
                },
                "busRoutePosition": [
                    {
                        "name": "U1X",
                        "position": 1
                    },
                    {
                        "name": "U2",
                        "position": 4
                    }
                ]
            },
            {
                "busStopId": 2,
                "busStopName": "University of Bath",
                "location": {
                    "latitude": 52.3456546,
                    "longitude": -1.3465544
                },
                "busRoutePosition": [
                    {
                        "name": "U1X",
                        "position": 4
                    },
                    {
                        "name": "U2",
                        "position": 7
                    }
                ]
            }
        ]
    };
    res.status(200);
    res.json(testData);
});
app.listen(8080, () => {
    console.log('mockup server listening on port 8080');
});
//# sourceMappingURL=server.js.map