"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Button_1 = require("./Button");
const Display_1 = require("./Display");
const GPSSensor_1 = require("./GPSSensor");
const events_1 = require("events");
const rp = require("request-promise");
class TrackingBox {
    constructor(displayOpts, buttonPin1, buttonPin2) {
        this.tracker = new BusLocationTracker();
        this.display = new Display_1.Display(displayOpts);
        this.button1 = new Button_1.Button(buttonPin1);
        this.button2 = new Button_1.Button(buttonPin2);
        this.busRoute = new BusRoute();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.init();
            try {
                while (true) {
                    yield this.loop();
                }
            }
            catch (e) {
                console.log('Error in main loop', e.message);
                this.exit();
            }
        });
    }
    loop() {
        return __awaiter(this, void 0, void 0, function* () {
            let busRoute;
            do {
                busRoute = yield this.getBusRouteSelection();
            } while (!(yield this.confirmStart(busRoute)));
            this.tracker.startNewRoute(busRoute);
            do {
                yield this.startRoute(busRoute);
                yield this.waitForCancel();
            } while (!(yield this.definitelyWantsToCancel(busRoute)));
            this.tracker.stopCurrentRoute();
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.display.started();
        });
    }
    getBusRouteSelection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.showStartingOption();
            let route;
            do {
                if (route)
                    this.busRoute.getNextRoute();
                route = this.busRoute.currentRoute;
                yield this.showBusRouteOption(route);
            } while ((yield this.waitForButtonPress()) === this.button2);
            return route;
        });
    }
    showStartingOption() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = 'Select a route:';
            yield this.display.writeMessage(0, Display_1.Display.ROW.TOP, message);
        });
    }
    showBusRouteOption(busRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.display.writeMessage(0, Display_1.Display.ROW.BOTTOM, busRoute + '             ');
        });
    }
    waitForButtonPress() {
        return new Promise(resolve => {
            let resolved = false;
            this.button1.waitForPress()
                .then(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(this.button1);
                }
            });
            this.button2.waitForPress()
                .then(() => {
                if (!resolved) {
                    resolved = true;
                    resolve(this.button2);
                }
            });
        });
    }
    confirmStart(busRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = [
                `ROUTE: ${busRoute}`,
                'CONFIRM   CANCEL'
            ];
            yield this.display.writeMessage(0, Display_1.Display.ROW.TOP, message[1]);
            yield this.display.writeMessage(0, Display_1.Display.ROW.BOTTOM, message[0]);
            const button = yield this.waitForButtonPress();
            return button === this.button1;
        });
    }
    startRoute(busRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.display.writeMessage(0, Display_1.Display.ROW.TOP, '          CANCEL');
            yield this.display.writeMessage(0, Display_1.Display.ROW.BOTTOM, `Started ${busRoute}`);
        });
    }
    waitForCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.button2.waitForPress();
        });
    }
    definitelyWantsToCancel(routeName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.display.writeMessage(0, Display_1.Display.ROW.TOP, 'CONFIRM   CANCEL');
            yield this.display.writeMessage(0, Display_1.Display.ROW.BOTTOM, `Stop route: ${routeName}?`);
            const button = yield this.waitForButtonPress();
            return button.pin === this.button1.pin;
        });
    }
    exit() {
        this.display.closeLcd();
        this.button1.closeButton();
        this.button2.closeButton();
    }
}
exports.TrackingBox = TrackingBox;
class BusRoute {
    constructor() {
        this.currentIndex = 0;
    }
    get currentRoute() {
        return BusRoute.ROUTES[this.currentIndex];
    }
    getNextRoute() {
        this.incrementRoute();
        return BusRoute.ROUTES[this.currentIndex];
    }
    incrementRoute() {
        this.currentIndex++;
        this.currentIndex %= BusRoute.ROUTES.length;
    }
}
BusRoute.ROUTES = ['U1 ', 'U1X', 'U2 '];
exports.BusRoute = BusRoute;
class BusLocationTracker {
    constructor() {
        this.events = new events_1.EventEmitter();
        this.gpsSensor = new GPSSensor_1.GPSSensor();
        this.gpsSensor.on('position', this.handlePositionUpdate.bind(this));
    }
    handlePositionUpdate(position) {
        if (typeof position.lat !== 'number' || isNaN(position.lat)) {
            position.lat = 51.380901;
            position.lon = -2.354876;
        }
        this.latestPosition = position;
        this.events.emit('position-updated');
    }
    startNewRoute(busRoute) {
        this.start(busRoute).catch(e => {
            console.log('error in loop', e.message);
        });
    }
    start(busRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureHasPosition();
            const busId = yield this.postNewBus(busRoute);
            if (!busId) {
                throw new Error('FUCK');
            }
            else {
                this.busId = busId;
                let success;
                let stop = false;
                this.events.once('stopping', () => {
                    stop = true;
                });
                do {
                    yield this.newPositionFromSensor();
                    if (stop)
                        return;
                    success = yield this.putNewPosition();
                    console.log('PUT SUCCESS: ' + success);
                } while (this.latestPosition !== undefined || stop);
                console.log('exiting loop');
            }
        });
    }
    ensureHasPosition() {
        return new Promise(resolve => {
            if (this.latestPosition) {
                resolve();
            }
            else {
                this.events.once('position-updated', () => {
                    resolve();
                });
            }
        });
    }
    postNewBus(busRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            const opts = {
                uri: BusLocationTracker.HOST_URL + '/buses',
                method: 'POST',
                body: {
                    data: {
                        location: {
                            latitude: this.latestPosition.lat,
                            longitude: this.latestPosition.lon
                        },
                        routeName: busRoute.replace(' ', '')
                    }
                },
                json: true
            };
            try {
                rp(opts);
                const json = yield rp(opts);
                const busId = (json && json.data && json.data.busId);
                console.log(json);
                if (busId) {
                    return busId;
                }
                else {
                    throw new Error('fuck.');
                }
            }
            catch (e) {
                console.log('Error posting bus', e.message);
            }
        });
    }
    putNewPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            const opts = {
                uri: `${BusLocationTracker.HOST_URL}/buses/${this.busId}/location`,
                method: 'PUT',
                body: {
                    data: {
                        location: {
                            latitude: this.latestPosition.lat,
                            longitude: this.latestPosition.lon
                        }
                    }
                },
                json: true
            };
            try {
                const json = yield rp(opts);
                if (json && json.status && json.status === 'success') {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                console.log('Error putting data...', e.message);
                return false;
            }
        });
    }
    newPositionFromSensor() {
        return new Promise(resolve => {
            this.events.once('position-updated', () => {
                resolve(this.latestPosition);
            });
        });
    }
    stopCurrentRoute() {
        this.latestPosition = undefined;
        this.events.emit('stopping');
    }
}
BusLocationTracker.HOST_URL = 'http://firstbustracker.ddns.net/api';
exports.BusLocationTracker = BusLocationTracker;
//# sourceMappingURL=TrackingBox.js.map