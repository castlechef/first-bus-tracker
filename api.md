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
                    }
                },
                {
                    "busId": 2,
                    "location": {
                        "latitude": 53.9643824,
                        "longitude": -2.295362
                    }
                },
                {
                    "busId": 3,
                    "location": {
                        "latitude": 53.837285,
                        "longitude": -2.276247
                    }
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

### Add a location [POST]

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
                }
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
                }
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
                }
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

### Update a Bus [PUT]

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
                }
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
                }
            },
            "error": {
                "code": 503,
                "message": "Service Unavailable"
            }
        }
```