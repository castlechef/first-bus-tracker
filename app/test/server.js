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
    allowedHeaders: ['Origin'],
    credentials: true,
    methods: 'GET,PUT,POST',
    origin: '*',
    preflightContinue: false
};
app.use(cors(options));
app.get('/buses/1', (req, res) => {
    const testData = {
        'status': 'success',
        'data': {
            'routeName': 'U1X',
            'location': {
                'latitude': 51.368600,
                'longitude': -2.336717
            },
            'nextBusStops': [
                { 'busStopId': 1, 'busStopName': 'Arrival\'s Square (Stop A)', 'expectedArrival': '09:23' },
                { 'busStopId': 5, 'busStopName': 'Youth Hostel', 'expectedArrival': '10:11' }
            ],
            'capacity': 0
        }
    };
    res.status(200);
    res.json(testData);
});
app.get('/buses/2', (req, res) => {
    const testData = {
        'status': 'success',
        'data': {
            'routeName': 'U1',
            'location': {
                'latitude': 51.368600,
                'longitude': -2.336717
            },
            'nextBusStops': [
                { 'busStopId': 1, 'busStopName': 'Arrival\'s Square (Stop A)', 'expectedArrival': '09:23' },
                { 'busStopId': 5, 'busStopName': 'Youth Hostel', 'expectedArrival': '10:11' }
            ],
            'capacity': 0
        }
    };
    res.status(200);
    res.json(testData);
});
app.get('/buses', (req, res) => {
    const testData = {
        'status': 'success',
        'data': [
            {
                'busId': 1,
                'location': {
                    'latitude': 51.368600,
                    'longitude': -2.336717
                },
                'routeName': 'U1X'
            },
            {
                'busId': 2,
                'location': {
                    'latitude': 51.368438,
                    'longitude': -2.355729
                },
                'routeName': 'U2'
            }
        ]
    };
    res.status(200);
    res.json(testData);
});
app.get('/busStops', (req, res) => {
    const testData = {
        'status': 'success',
        'data': [
            {
                'busStopId': 0,
                'busStopName': 'Arrivals Square (Stop C)',
                'location': {
                    'latitude': 51.378845,
                    'longitude': -2.324927
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 1
                    }
                ]
            },
            {
                'busStopId': 1,
                'busStopName': 'The Avenue (Southbound)',
                'location': {
                    'latitude': 51.3760679,
                    'longitude': -2.3243903
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 2
                    },
                    {
                        'name': 'U1X',
                        'position': 2
                    },
                    {
                        'name': 'U2',
                        'position': 2
                    }
                ]
            },
            {
                'busStopId': 2,
                'busStopName': 'Rainbow Wood Farm',
                'location': {
                    'latitude': 51.3725468,
                    'longitude': -2.3224108
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 3
                    }
                ]
            },
            {
                'busStopId': 3,
                'busStopName': 'Brassknocker Hill',
                'location': {
                    'latitude': 51.365948,
                    'longitude': -2.3197219
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 4
                    }
                ]
            },
            {
                'busStopId': 4,
                'busStopName': 'Flatwoods Road',
                'location': {
                    'latitude': 51.3653829,
                    'longitude': -2.3218583
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 5
                    }
                ]
            },
            {
                'busStopId': 5,
                'busStopName': 'Ralph Allen School',
                'location': {
                    'latitude': 51.3637848,
                    'longitude': -2.3310113
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 6
                    }
                ]
            },
            {
                'busStopId': 6,
                'busStopName': 'Shaft Road',
                'location': {
                    'latitude': 51.3629001,
                    'longitude': -2.3390767
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 7
                    }
                ]
            },
            {
                'busStopId': 7,
                'busStopName': 'Tyning Road',
                'location': {
                    'latitude': 51.362556,
                    'longitude': -2.3423349
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 8
                    }
                ]
            },
            {
                'busStopId': 8,
                'busStopName': 'Hadley Arms',
                'location': {
                    'latitude': 51.3620745,
                    'longitude': -2.3461718
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 9
                    }
                ]
            },
            {
                'busStopId': 9,
                'busStopName': 'The Firs',
                'location': {
                    'latitude': 51.3611789,
                    'longitude': -2.348787
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 10
                    }
                ]
            },
            {
                'busStopId': 10,
                'busStopName': 'Combe Road',
                'location': {
                    'latitude': 51.3604349,
                    'longitude': -2.3510937
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 11
                    }
                ]
            },
            {
                'busStopId': 11,
                'busStopName': 'Mulberry Park',
                'location': {
                    'latitude': 51.3600254,
                    'longitude': -2.3529625
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 12
                    }
                ]
            },
            {
                'busStopId': 12,
                'busStopName': 'Foxhill House',
                'location': {
                    'latitude': 51.3591582,
                    'longitude': -2.3573459
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 13
                    }
                ]
            },
            {
                'busStopId': 13,
                'busStopName': 'Bradford Road Shops',
                'location': {
                    'latitude': 51.3589099,
                    'longitude': -2.3592979
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 14
                    }
                ]
            },
            {
                'busStopId': 14,
                'busStopName': 'Entry Hill',
                'location': {
                    'latitude': 51.358376,
                    'longitude': -2.3629121
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 15
                    }
                ]
            },
            {
                'busStopId': 15,
                'busStopName': 'Sainsbury\'s',
                'location': {
                    'latitude': 51.356926,
                    'longitude': -2.3716468
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 16
                    }
                ]
            },
            {
                'busStopId': 16,
                'busStopName': 'Fosseway School',
                'location': {
                    'latitude': 51.358173,
                    'longitude': -2.3752047
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 17
                    }
                ]
            },
            {
                'busStopId': 17,
                'busStopName': 'Red Lion',
                'location': {
                    'latitude': 51.358837,
                    'longitude': -2.3764881
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 18
                    }
                ]
            },
            {
                'busStopId': 18,
                'busStopName': 'Noads Corner',
                'location': {
                    'latitude': 51.360344,
                    'longitude': -2.3798181
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 19
                    }
                ]
            },
            {
                'busStopId': 19,
                'busStopName': 'Barrow Road',
                'location': {
                    'latitude': 51.3615302,
                    'longitude': -2.3830448
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 20
                    }
                ]
            },
            {
                'busStopId': 20,
                'busStopName': 'Somerdale View',
                'location': {
                    'latitude': 51.3621745,
                    'longitude': -2.3851631
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 21
                    }
                ]
            },
            {
                'busStopId': 21,
                'busStopName': 'Bath Community Academy',
                'location': {
                    'latitude': 51.3644329,
                    'longitude': -2.39199
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 22
                    }
                ]
            },
            {
                'busStopId': 22,
                'busStopName': 'Padleigh Turn',
                'location': {
                    'latitude': 51.3661729,
                    'longitude': -2.3928671
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 23
                    }
                ]
            },
            {
                'busStopId': 23,
                'busStopName': 'Southdown Road',
                'location': {
                    'latitude': 51.3671529,
                    'longitude': -2.3904759
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 24
                    }
                ]
            },
            {
                'busStopId': 24,
                'busStopName': 'Sladebrook Court',
                'location': {
                    'latitude': 51.3682598,
                    'longitude': -2.3874892
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 25
                    }
                ]
            },
            {
                'busStopId': 25,
                'busStopName': 'Trowbridge House',
                'location': {
                    'latitude': 51.370792,
                    'longitude': -2.3858812
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 26
                    }
                ]
            },
            {
                'busStopId': 26,
                'busStopName': 'Happy Garden',
                'location': {
                    'latitude': 51.3724062,
                    'longitude': -2.3846602
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 27
                    }
                ]
            },
            {
                'busStopId': 27,
                'busStopName': 'Ascension Church',
                'location': {
                    'latitude': 51.3744351,
                    'longitude': -2.3828658
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 28
                    }
                ]
            },
            {
                'busStopId': 28,
                'busStopName': 'Bridge Road',
                'location': {
                    'latitude': 51.3758088,
                    'longitude': -2.3827203
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 29
                    }
                ]
            },
            {
                'busStopId': 29,
                'busStopName': 'Mayfield Road',
                'location': {
                    'latitude': 51.3759691,
                    'longitude': -2.381471
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 30
                    }
                ]
            },
            {
                'busStopId': 30,
                'busStopName': 'Moorland Road',
                'location': {
                    'latitude': 51.3774219,
                    'longitude': -2.3787238
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 31
                    }
                ]
            },
            {
                'busStopId': 31,
                'busStopName': 'Arlington Road',
                'location': {
                    'latitude': 51.3781929,
                    'longitude': -2.3772372
                },
                'busRoutePosition': [
                    {
                        'name': 'U2',
                        'position': 32
                    }
                ]
            },
            {
                'busStopId': 32,
                'busStopName': 'Brougham Hayes',
                'location': {
                    'latitude': 51.3810272,
                    'longitude': -2.3736249
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 17
                    },
                    {
                        'name': 'U1X',
                        'position': 18
                    },
                    {
                        'name': 'U2',
                        'position': 33
                    }
                ]
            },
            {
                'busStopId': 33,
                'busStopName': 'Pines Way',
                'location': {
                    'latitude': 51.3806422,
                    'longitude': -2.3709923
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 18
                    },
                    {
                        'name': 'U1X',
                        'position': 19
                    },
                    {
                        'name': 'U2',
                        'position': 34
                    }
                ]
            },
            {
                'busStopId': 34,
                'busStopName': 'Riverside Road',
                'location': {
                    'latitude': 51.378719,
                    'longitude': -2.3675711
                },
                'busRoutePosition': [
                    {
                        'name': 'U1X',
                        'position': 20
                    },
                    {
                        'name': 'U2',
                        'position': 35
                    }
                ]
            },
            {
                'busStopId': 35,
                'busStopName': 'Oak Street (Eastbound)',
                'location': {
                    'latitude': 51.3784901,
                    'longitude': -2.3654998
                },
                'busRoutePosition': [
                    {
                        'name': 'U1X',
                        'position': 21
                    },
                    {
                        'name': 'U2',
                        'position': 36
                    }
                ]
            },
            {
                'busStopId': 36,
                'busStopName': 'Rossiter Road',
                'location': {
                    'latitude': 51.3770055,
                    'longitude': -2.3578025
                },
                'busRoutePosition': [
                    {
                        'name': 'U1X',
                        'position': 22
                    },
                    {
                        'name': 'U2',
                        'position': 37
                    }
                ]
            },
            {
                'busStopId': 37,
                'busStopName': 'Pulteney Court (Northbound)',
                'location': {
                    'latitude': 51.3781389,
                    'longitude': -2.3514739
                },
                'busRoutePosition': [
                    {
                        'name': 'U1X',
                        'position': 23
                    },
                    {
                        'name': 'U2',
                        'position': 38
                    }
                ]
            },
            {
                'busStopId': 38,
                'busStopName': 'Pulteney Gardens (Northbound)',
                'location': {
                    'latitude': 51.3799901,
                    'longitude': -2.3513163
                },
                'busRoutePosition': [
                    {
                        'name': 'U1X',
                        'position': 24
                    },
                    {
                        'name': 'U2',
                        'position': 39
                    }
                ]
            },
            {
                'busStopId': 39,
                'busStopName': 'St Mary\'s Church',
                'location': {
                    'latitude': 51.3839299,
                    'longitude': -2.3509153
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 24
                    },
                    {
                        'name': 'U1X',
                        'position': 25
                    },
                    {
                        'name': 'U2',
                        'position': 40
                    }
                ]
            },
            {
                'busStopId': 40,
                'busStopName': 'Sydney Buildings',
                'location': {
                    'latitude': 51.3826899,
                    'longitude': -2.3481607
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 25
                    },
                    {
                        'name': 'U1X',
                        'position': 26
                    },
                    {
                        'name': 'U2',
                        'position': 41
                    }
                ]
            },
            {
                'busStopId': 41,
                'busStopName': 'Cleveland Walk (Eastbound)',
                'location': {
                    'latitude': 51.3809891,
                    'longitude': -2.3455328
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 26
                    },
                    {
                        'name': 'U1X',
                        'position': 27
                    },
                    {
                        'name': 'U2',
                        'position': 42
                    }
                ]
            },
            {
                'busStopId': 42,
                'busStopName': 'White Lodge (Eastbound)',
                'location': {
                    'latitude': 51.379757,
                    'longitude': -2.342693
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 27
                    },
                    {
                        'name': 'U1X',
                        'position': 28
                    },
                    {
                        'name': 'U2',
                        'position': 43
                    }
                ]
            },
            {
                'busStopId': 43,
                'busStopName': 'Youth Hostel (Eastbound)',
                'location': {
                    'latitude': 51.3785859,
                    'longitude': -2.3399967
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 28
                    },
                    {
                        'name': 'U1X',
                        'position': 29
                    },
                    {
                        'name': 'U2',
                        'position': 44
                    }
                ]
            },
            {
                'busStopId': 44,
                'busStopName': 'Smallcombe House (Eastbound)',
                'location': {
                    'latitude': 51.3778652,
                    'longitude': -2.3375639
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 29
                    },
                    {
                        'name': 'U1X',
                        'position': 30
                    },
                    {
                        'name': 'U2',
                        'position': 45
                    }
                ]
            },
            {
                'busStopId': 45,
                'busStopName': 'Woodland Place (Eastbound)',
                'location': {
                    'latitude': 51.3774341,
                    'longitude': -2.333839
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 30
                    },
                    {
                        'name': 'U1X',
                        'position': 31
                    },
                    {
                        'name': 'U2',
                        'position': 46
                    }
                ]
            },
            {
                'busStopId': 46,
                'busStopName': 'North Road (Eastbound)',
                'location': {
                    'latitude': 51.3766062,
                    'longitude': -2.3315202
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 31
                    },
                    {
                        'name': 'U1X',
                        'position': 32
                    },
                    {
                        'name': 'U2',
                        'position': 47
                    }
                ]
            },
            {
                'busStopId': 47,
                'busStopName': 'Oakley',
                'location': {
                    'latitude': 51.3742409,
                    'longitude': -2.3281842
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 32
                    },
                    {
                        'name': 'U1X',
                        'position': 33
                    },
                    {
                        'name': 'U2',
                        'position': 48
                    }
                ]
            },
            {
                'busStopId': 48,
                'busStopName': 'The Avenue (Northbound)',
                'location': {
                    'latitude': 51.375916,
                    'longitude': -2.3247048
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 33
                    },
                    {
                        'name': 'U1X',
                        'position': 34
                    },
                    {
                        'name': 'U2',
                        'position': 49
                    }
                ]
            },
            {
                'busStopId': 49,
                'busStopName': 'Arrivals Square (Stop A)',
                'location': {
                    'latitude': 51.379070,
                    'longitude': -2.325222
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 1
                    },
                    {
                        'name': 'U1X',
                        'position': 1
                    }
                ]
            },
            {
                'busStopId': 50,
                'busStopName': 'Oakley',
                'location': {
                    'latitude': 51.3744091,
                    'longitude': -2.329062
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 3
                    },
                    {
                        'name': 'U1X',
                        'position': 3
                    }
                ]
            },
            {
                'busStopId': 51,
                'busStopName': 'North Road (Westbound)',
                'location': {
                    'latitude': 51.3768272,
                    'longitude': -2.3321251
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 4
                    },
                    {
                        'name': 'U1X',
                        'position': 4
                    }
                ]
            },
            {
                'busStopId': 52,
                'busStopName': 'Woodland Place (Westbound)',
                'location': {
                    'latitude': 51.3775061,
                    'longitude': -2.3344579
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 5
                    },
                    {
                        'name': 'U1X',
                        'position': 5
                    }
                ]
            },
            {
                'busStopId': 53,
                'busStopName': 'Smallcombe House (Westbound)',
                'location': {
                    'latitude': 51.3777919,
                    'longitude': -2.3379649
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 6
                    },
                    {
                        'name': 'U1X',
                        'position': 6
                    }
                ]
            },
            {
                'busStopId': 54,
                'busStopName': 'Youth Hostel (Westbound)',
                'location': {
                    'latitude': 51.3786659,
                    'longitude': -2.3403997
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 7
                    },
                    {
                        'name': 'U1X',
                        'position': 7
                    }
                ]
            },
            {
                'busStopId': 55,
                'busStopName': 'White Lodge (Westbound)',
                'location': {
                    'latitude': 51.3799131,
                    'longitude': -2.3437002
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 8
                    },
                    {
                        'name': 'U1X',
                        'position': 8
                    }
                ]
            },
            {
                'busStopId': 56,
                'busStopName': 'Cleveland Walk (Westbound)',
                'location': {
                    'latitude': 51.3809171,
                    'longitude': -2.3456468
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 9
                    },
                    {
                        'name': 'U1X',
                        'position': 9
                    }
                ]
            },
            {
                'busStopId': 57,
                'busStopName': 'Raby Gardens',
                'location': {
                    'latitude': 51.3832779,
                    'longitude': -2.3502488
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 10
                    },
                    {
                        'name': 'U1X',
                        'position': 10
                    }
                ]
            },
            {
                'busStopId': 58,
                'busStopName': 'Pulteney Gardens (Southbound)',
                'location': {
                    'latitude': 51.3795619,
                    'longitude': -2.3510829
                },
                'busRoutePosition': [
                    {
                        'name': 'U1X',
                        'position': 11
                    }
                ]
            },
            {
                'busStopId': 59,
                'busStopName': 'Pulteney Court (Southbound)',
                'location': {
                    'latitude': 51.3783988,
                    'longitude': -2.3511017
                },
                'busRoutePosition': [
                    {
                        'name': 'U1X',
                        'position': 12
                    }
                ]
            },
            {
                'busStopId': 60,
                'busStopName': 'Lyncombe Hill',
                'location': {
                    'latitude': 51.376576,
                    'longitude': -2.3568564
                },
                'busRoutePosition': [
                    {
                        'name': 'U1X',
                        'position': 13
                    }
                ]
            },
            {
                'busStopId': 61,
                'busStopName': 'Oak Street (Westbound)',
                'location': {
                    'latitude': 51.3784101,
                    'longitude': -2.3657721
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 13
                    },
                    {
                        'name': 'U1X',
                        'position': 14
                    }
                ]
            },
            {
                'busStopId': 62,
                'busStopName': 'Cheltenham Street',
                'location': {
                    'latitude': 51.3783842,
                    'longitude': -2.3685877
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 14
                    },
                    {
                        'name': 'U1X',
                        'position': 15
                    }
                ]
            },
            {
                'busStopId': 63,
                'busStopName': 'Hayesfield School',
                'location': {
                    'latitude': 51.377144,
                    'longitude': -2.3709923
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 15
                    },
                    {
                        'name': 'U1X',
                        'position': 16
                    }
                ]
            },
            {
                'busStopId': 64,
                'busStopName': 'Junction Road',
                'location': {
                    'latitude': 51.3776212,
                    'longitude': -2.3738978
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 16
                    },
                    {
                        'name': 'U1X',
                        'position': 17
                    }
                ]
            },
            {
                'busStopId': 65,
                'busStopName': 'North Parade',
                'location': {
                    'latitude': 51.3807489,
                    'longitude': -2.356322
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 11
                    }
                ]
            },
            {
                'busStopId': 66,
                'busStopName': 'Dorchester Street (Westbound)',
                'location': {
                    'latitude': 51.377869,
                    'longitude': -2.3576939
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 12
                    }
                ]
            },
            {
                'busStopId': 67,
                'busStopName': 'Green Park',
                'location': {
                    'latitude': 51.3805472,
                    'longitude': -2.3662783
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 19
                    }
                ]
            },
            {
                'busStopId': 68,
                'busStopName': 'Corn Street',
                'location': {
                    'latitude': 51.3792108,
                    'longitude': -2.3624307
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 20
                    }
                ]
            },
            {
                'busStopId': 69,
                'busStopName': 'Dorchester Street (Eastbound)',
                'location': {
                    'latitude': 51.3780439,
                    'longitude': -2.359031
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 21
                    }
                ]
            },
            {
                'busStopId': 70,
                'busStopName': 'Guildhall',
                'location': {
                    'latitude': 51.3816805,
                    'longitude': -2.3586655
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 22
                    }
                ]
            },
            {
                'busStopId': 71,
                'busStopName': 'The Pavilion',
                'location': {
                    'latitude': 51.3809008,
                    'longitude': -2.3540957
                },
                'busRoutePosition': [
                    {
                        'name': 'U1',
                        'position': 23
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