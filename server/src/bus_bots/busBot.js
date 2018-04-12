"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const busStops_1 = require("../models/busStops");
const utils_1 = require("../utils/utils");
const rp = require("request-promise");
var randomBetweenNumbers = utils_1.Utils.Numeric.randomBetweenNumbers;
class BusBot {
    constructor(routeName, mph, milliseconds) {
        this.distancePerMove = 30; //metres
        if (typeof milliseconds === 'string')
            milliseconds = parseInt(milliseconds);
        this.milliseconds = milliseconds;
        this.speed = this.milesPerHourToMetersPerSecond(mph);
        this.routeName = routeName;
        const data = require('../../data.json');
        const busStops = new busStops_1.BusStops(data.busStops);
        this.routeStops = busStops.getStopsWithRoute(routeName);
        if (this.routeStops.length < 2)
            throw new Error('Bus route must have at least 2 stops');
        this.nextBusStopIndex = Math.floor(randomBetweenNumbers(0, this.routeStops.length));
    }
    async startFollowing() {
        const nextLocation = this.getNextLocation();
        this.currentLocation = nextLocation;
        const options = {
            method: 'POST',
            uri: 'http://localhost:8080/buses',
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
            console.log('Post successful!');
            console.log(data.data);
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
            uri: `http://localhost:8080/buses/${this.busId}/location`,
            body: {
                data: {
                    location: this.currentLocation.toJSON()
                }
            },
            json: true
        };
        try {
            const data = await rp(options);
            console.log('Put successful!');
            console.log(data.data);
        }
        catch (e) {
            console.log('Error!!', e.message);
            throw new Error('Cannot PUT :(');
        }
    }
    move() {
        let distanceToMove = (this.speed * this.milliseconds) / 1000; //this.distancePerMove;
        console.log('distanceToMove', distanceToMove);
        console.log(this.speed, this.milliseconds);
        let distanceToNextStop = this.peakNextLocation().distanceFrom(this.currentLocation);
        while (distanceToMove > distanceToNextStop) {
            distanceToMove -= distanceToNextStop;
            this.currentLocation = this.getNextLocation();
            distanceToNextStop = this.peakNextLocation().distanceFrom(this.currentLocation);
        }
        this.currentLocation = this.currentLocation.moveInDirectionOf(this.peakNextLocation(), distanceToMove);
    }
    peakNextLocation() {
        return this.routeStops[this.nextBusStopIndex].location;
    }
    getNextLocation() {
        const location = this.peakNextLocation();
        this.nextBusStopIndex = (this.nextBusStopIndex + 1) % this.routeStops.length;
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
const b = new BusBot(busRoute, parseInt(mph), interval);
b.startFollowing().then(() => {
    setTimeout(() => {
        b.runPutRequestOnInterval();
    }, interval);
});
//# sourceMappingURL=busBot.js.map