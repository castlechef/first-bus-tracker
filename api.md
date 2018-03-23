FORMAT: 1A

# GPS Location API
This API allows buses to update their live location on the First Bus Tracking system.

## Info
+ [Markdown cheatsheeet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links)
+ [api blueprint](https://apiblueprint.org)
+ [Http error codes](http://www.restapitutorial.com/httpstatuscodes.html)
+ [Google error handling](https://cloud.google.com/storage/docs/json_api/v1/status-codes)
+ [Online markdown editing](https://stackedit.io)

# Group Bus
Group of all bus-related resources.

## Buses [/buses/]
    
### Request all Bus Locations [GET]
Allows clients to get the latest list of buses and their locations.

+ Request (application/json)

    + Headers

            Accept: application/json

+ Response 200 (application/json)
        
    + Body
```json
        {
            "status": "success",
            "data": [
                {
                    "busId": 1,
                    "location": {
                        "latitude": 53.003444,
                        "longitude": -2.273507
                    },
                    "routeName": "U2"
                },
                {
                    "busId": 2,
                    "location": {
                        "latitude": 53.9643824,
                        "longitude": -2.295362
                    },
                    "routeName": "U2"
                },
                {
                    "busId": 3,
                    "location": {
                        "latitude": 53.837285,
                        "longitude": -2.276247
                    },
                    "routeName": "U1X"
                }
            ]
        }
```

+ Response 503 (application/json)

    + Body
```json
        {
            "status": "failure",
            "error": {
                "code": 503,
                "message": "Service Unavailable"
            }
        }
```

### Add a Bus [POST]

Allows a new bus to register to the server with its location. The
system generates an id for the bus and returns it in the data object.

+ Request (application/json)

    + Headers

            Accept: application/json

    + Body
```json
        {
            "data": {
                "location": {
                    "latitude": 53.003444,
                    "longitude": -2.273507 
                },
                "routeName": "U1 City Centre"
            }
        }
```

+ Response 200 (application/json)

    + Body
```json
        {
            "data": {
                "busId": 1,
                "location": {
                    "latitude": 53.003444,
                    "longitude": -2.273507
                },
                "routeName": "U1 City Centre"
            }
        }
```

+ Response 422 (application/json)

    + Body
```json
        {
            "status": "failure",
            "error": {
                "code": 422,
                "message": "Unprocessable Entity"
            }
        }
```

+ Response 503 (application/json)

    + Body
```json
        {
            "status": "failure",
            "data": {
                "location": {
                    "latitude": 53.003444,
                    "longitude": -2.273507
                },
                "routeName": "U1 City Centre"
            },
            "error": {
                "code": 503,
                "message": "Service Unavailable"
            }
        }
```

## Bus [/buses/{busId}]

+ Parameters

    + busId (number) - a unique identifier for a specific bus.

### Get a Bus [GET]
This allows client to view location of bus and expected arrival
times at each of it's stops, and up to two previous bus stop
departure times.

+ Response 200 (application/json)
        
    + Body
```json
        {
            "data": {
                "busId": 0,
                "location": {
                    "latitude": 53.003444,
                    "longitude": -2.273507
                },
                "routeName": "U1",
                "capacity": "FULL",
                "departureTimes": [
                    {
                        "busStopId": 32,
                        "busStopName": "A bus stop",
                        "departureTime": "12:19"
                    },
                    {
                       "busStopId": 33,
                       "busStopName": "Another bus stop",
                       "departureTime": "12:21"
                    }
                ],
                "expectedArrivals": [
                    {
                        "busStopId": 1,
                        "busStopName": "Junction Road",
                        "arrivalTime": "12:23"
                    },
                    {
                        "busStopId": 2,
                        "busStopName": "Brougham Hayes",
                        "arrivalTime": "12:25"
                    }
                ]
            }
        }
```

+ Response 404 (application/json)
        
    + Body
```json
        {
            "status": "failure",
            "data": {
                "busId": 1
            },
            "error": {
                "code": 404,
                "message": "Not Found"
            }
        }
```

+ Response 503 (application/json)

    + Body
```json
        {
            "status": "failure",
            "error": {
                "code": 503,
                "message": "Service Unavailable"
            }
        }
```

## Bus Location [/buses/{busId}/location]

### Update a Bus Location [PUT]

This allows a registered bus to inform the server of a location
update.

+ Request (application/json)

    + Headers

            Accept: application/json
    
    + Body
```json
        {
            "data": {
                "location": {
                    "latitude": 53.003444,
                    "longitude": -2.273507
                }
            }
        }
```

+ Response 200 (application/json)
    
    + Body
```json
        {
            "status": "success",
            "data": {
                "busId": 1,
                "location": {
                    "latitude": 53.003444,
                    "longitude": -2.273507
                },
                "routeName": "U1 City Centre"
            }
        }
```

+ Response 404 (application/json)
        
    + Body
```json
        {
            "status": "failure",
            "data": {
                "busId": 1,
                "location": {
                    "latitude": 53.003444,
                    "longitude": -2.273507 
                }
            },
            "error": {
                "code": 404,
                "message": "Not Found"
            }
        }
```

+ Response 422 (application/json)

    + Body
```json
        {
            "status": "failure",
            "error": {
                "code": 422,
                "message": "Unprocessable Entity"
            }
        }
```

+ Response 503 (application/json)

    + Body
```json
        {
            "status": "failure",
            "data": {
                "busId": 1,
                "location": {
                    "latitude": 53.003444,
                    "longitude": -2.273507 
                },
                "routeName": "U1 City Centre"
            },
            "error": {
                "code": 503,
                "message": "Service Unavailable"
            }
        }
```

## Bus Capacity [/buses/{busId}/capacity]

### Update a Bus Capacity

This allows a client to send the capacity of a specific bus.

+ Request (application/json)

    + Headers

            Accept: application/json
    
    + Body
```json
        {
            "data": {
                "capacity": "EMPTY"
            }
        }
```

+ Response 200 (application/json)

    + Body
```json
        {
            "data": {
                "busId": 1,
                "capacity": "EMPTY"
            }
        }
```

+ Response 404 (application/json)
        
    + Body
```json
        {
            "status": "failure",
            "data": {
                "busId": 1,
                "capacity": "EMPTY"
            },
            "error": {
                "code": 404,
                "message": "Not Found"
            }
        }
```

+ Response 422 (application/json)

    + Body
```json
        {
            "status": "failure",
            "error": {
                "code": 422,
                "message": "Unprocessable Entity"
            }
        }
```

+ Response 503 (application/json)

    + Body
```json
        {
            "status": "failure",
            "error": {
                "code": 503,
                "message": "Service Unavailable"
            }
        }
```

# Group Bus Stop
Group of all bus stop-related resources.

## Bus stops [/busStops/]

### Request all Bus Stops [GET]
Allows clients to get a list of all University bus stops in Bath.

+ Request (application/json)

    + Headers

            Accept: application/json

+ Response 200 (application/json)

    + Body
```json
        {
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
        }
```

+ Response 503 (application/json)

    + Body
```json
        {
            "status": "failure",
            "error": {
                "code": 503,
                "message": "Service Unavailable"
            }
        }
```

## Bus stop [/busStops/{busStopId}]

+ Parameters

    + busStopId (number) - a unique identifier for a specific bus stop.

### Request a specific bus stop [GET]
Allows the client to receive data specific to a bus stop, including location and arrival times for nearby buses.

+ Request (application/json)

    + Headers

            Accept: application/json

+ Response 200 (application/json)

    + Body
```json
        {
            "status": "success",
            "data": {
                "busStopId": 1,
                "busStopName": "Junction Road",
                "location": {
                    "latitude": 52.3456546,
                    "longitude": -1.3465544
                },
                "arrivals": [
                    {
                        "busId": 1,
                        "routeName": "U1",
                        "arrivalTime": "09:50"
                    },
                    {
                        "busId": 2,
                        "routeName": "U1X",
                        "arrivalTime": "09:53"
                    }
                ]
            }
        }
```

