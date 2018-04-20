"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const busStops_1 = require("../models/busStops");
const location_1 = require("../models/location");
const rp = require("request-promise");
const host = 'http://localhost/api';
//const host = 'http://firstbustracker.ddns.net/api';
class BusBot {
    constructor(routeName, mph, milliseconds, frac) {
        this.distancePerMove = 30; //metres
        if (typeof milliseconds === 'string')
            milliseconds = parseInt(milliseconds);
        this.milliseconds = milliseconds;
        this.speed = this.milesPerHourToMetersPerSecond(mph);
        this.routeName = routeName;
        const data = require('../data/busStops.json');
        const busStops = new busStops_1.BusStops(data.busStops);
        //this.routeStops = busStops.getStopsWithRoute(routeName);
        this.waypoints = this.getPointsOfRoute();
        //if (this.routeStops.length < 2) throw new Error('Bus route must have at least 2 stops');
        this.waypointIndex = 0;
        const length = location_1.Location.distanceBetweenN(this.waypoints);
        this.moveDistance(length * frac);
        //this.waypointIndex = Math.floor(randomBetweenNumbers(0, this.waypoints.length));
        console.log('Total route length: ' + location_1.Location.distanceBetweenN(this.waypoints));
    }
    getPointsOfRoute() {
        const { busRoutes, sections } = require('../data/busRoutes.json');
        if (!busRoutes.some(busRoute => busRoute.busRouteName === this.routeName))
            throw new Error('Route not found');
        const busRoute = busRoutes.find(r => r.busRouteName === this.routeName);
        function getPositionsFromSectionId(id) {
            //console.log('getting positions from section id ' + id);
            if (id < 0)
                return getPositionsFromSectionId(-id).reverse();
            const section = sections.find(section => section.sectionId === id);
            //console.log(section);
            return section.positions.map(l => new location_1.Location(l));
        }
        let positionList = [];
        busRoute.order.forEach(id => {
            let points = getPositionsFromSectionId(id);
            points.forEach(point => positionList.push(point));
        });
        return positionList;
    }
    async startFollowing() {
        const nextLocation = this.getNextLocation();
        this.currentLocation = nextLocation;
        const options = {
            method: 'POST',
            uri: `${host}/buses`,
            body: {
                data: {
                    location: nextLocation.toJSON(),
                    routeName: this.routeName
                }
            },
            json: true
        };
        try {
            const data = await rp(options);
            this.busId = data.data.busId;
            //console.log('Post successful!');
            //console.log(data.data);
        }
        catch (e) {
            console.log('Error!!', e.message);
            throw new Error('Cannot start following :(');
        }
    }
    runPutRequestOnInterval() {
        if (this.interval) {
            console.log('Removing previous interval.');
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => {
            this.runPutRequest()
                .then(() => {
                console.log('Interval put request success');
            })
                .catch(err => {
                //console.log('Interval put request failure', err.message);
            });
        }, this.milliseconds);
    }
    async runPutRequest() {
        this.move();
        const options = {
            method: 'PUT',
            uri: `${host}/buses/${this.busId}/location`,
            body: {
                data: {
                    location: this.currentLocation.toJSON()
                }
            },
            json: true
        };
        try {
            const data = await rp(options);
            //console.log('Put successful!');
            //console.log(data.data);
        }
        catch (e) {
            console.log('Error!!', e.message);
            throw new Error('Cannot PUT :(');
        }
    }
    move() {
        let distanceToMove = (this.speed * this.milliseconds) / 1000; //this.distancePerMove;
        //console.log('distanceToMove',distanceToMove);
        //console.log(this.speed,this.milliseconds);
        let distanceToNextPosition = this.peakNextLocation().distanceFrom(this.currentLocation);
        while (distanceToMove > distanceToNextPosition) {
            distanceToMove -= distanceToNextPosition;
            this.currentLocation = this.getNextLocation();
            distanceToNextPosition = this.peakNextLocation().distanceFrom(this.currentLocation);
        }
        this.currentLocation = this.currentLocation.moveInDirectionOf(this.peakNextLocation(), distanceToMove);
    }
    moveDistance(distanceToMove) {
        this.currentLocation = this.getNextLocation();
        let distanceToNextPosition = this.peakNextLocation().distanceFrom(this.currentLocation);
        while (distanceToMove > distanceToNextPosition) {
            distanceToMove -= distanceToNextPosition;
            this.currentLocation = this.getNextLocation();
            distanceToNextPosition = this.peakNextLocation().distanceFrom(this.currentLocation);
        }
    }
    peakNextLocation() {
        return this.waypoints[this.waypointIndex];
    }
    getNextLocation() {
        const location = this.peakNextLocation();
        this.waypointIndex = (this.waypointIndex + 1) % this.waypoints.length;
        return location;
    }
    stopFollowing() {
        clearInterval(this.interval);
    }
    milesPerHourToMetersPerSecond(mph) {
        return mph * 0.44704;
    }
}
exports.BusBot = BusBot;
function getOptionsFromArray(optionsArr) {
    return optionsArr
        .filter(optionStr => /^--\S+=\S+$/g.test(optionStr))
        .map(optionStr => optionStr.replace('--', '').split('='))
        .reduce((o, arr) => (Object.assign({}, o, { [dashedToCamelCase(arr[0])]: dashedToSpaced(arr[1]) })), {});
}
function dashedToCamelCase(dashed) {
    if (!dashed.includes('-'))
        return dashed;
    let parts = dashed.split('-').filter(s => s.length > 0);
    return [parts.shift(), ...parts.map(s => s.replace(/^[a-z]/g, c => c.toUpperCase()))].join('');
}
function dashedToSpaced(dashed) {
    return dashed.split('-').join(' ');
}
const { busRoute, interval = 1000, mph = '25' } = getOptionsFromArray(process.argv.slice(2));
console.log('mph', mph);
const fracs = [0, 0.5];
fracs.forEach(frac => {
    const b = new BusBot('U1X', parseInt(mph), interval, frac);
    b.startFollowing().then(() => {
        setTimeout(() => {
            b.runPutRequestOnInterval();
        }, interval);
    });
});
//# sourceMappingURL=busBot.js.map