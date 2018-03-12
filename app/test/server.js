"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
app.get('/buses', function (req, res) {
    var testData = {
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
            },
        ]
    };
    res.status(200);
    res.json(testData);
});
app.listen(8080, function () {
    console.log('mockup server listening on port 8080, routes added');
});
