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
class TrackingBox {
    constructor(displayOpts, buttonPin1, buttonPin2) {
        this.display = new Display_1.Display(displayOpts);
        this.button1 = new Button_1.Button(buttonPin1);
        this.button2 = new Button_1.Button(buttonPin2);
        this.busRoute = new BusRoute();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // STEPS:
            // get route
            // select start / cancel
            // show route, cancel
            // on error, cancel
            // loop
            console.log('TrackingBox - start');
            yield this.init();
            try {
                while (true) {
                    yield this.loop();
                }
            }
            catch (e) {
                console.log('Error in loop!');
                this.exit();
                console.log(e.message);
            }
        });
    }
    loop() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('TrackingBox - loop');
            let busRoute;
            do {
                console.log('TrackingBox - loop, awaiting busRoute selection');
                busRoute = yield this.getBusRouteSelection();
                console.log('TrackingBox - have busRoute selection: ' + busRoute);
            } while (!(yield this.confirmStart(busRoute)));
            console.log('TrackingBox - have confirmed bus route ' + busRoute);
            do {
                console.log('TrackingBox - awaiting route start');
                yield this.startRoute(busRoute);
                yield this.button2.waitForPress();
            } while (!(yield this.confirmCancel(busRoute)));
            console.log('TrackingBox - cancel pressed');
            yield this.waitForCancel();
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
            do {
                yield this.showBusRouteOption(this.busRoute.currentRoute);
                this.busRoute.getNextRoute();
            } while ((yield this.waitForButtonPress()) === this.button2);
            return this.busRoute.currentRoute;
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
            yield this.display.writeMessage(0, Display_1.Display.ROW.TOP, '          Cancel');
            yield this.display.writeMessage(0, Display_1.Display.ROW.BOTTOM, `Started ${busRoute}`);
        });
    }
    waitForCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.button2.waitForPress();
        });
    }
    confirmCancel(routeName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.display.writeMessage(0, Display_1.Display.ROW.TOP, 'CONFIRM   CANCEL');
            yield this.display.writeMessage(0, Display_1.Display.ROW.BOTTOM, `Route: ${routeName}`);
            const button = yield this.waitForButtonPress();
            return button === this.button2;
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
//# sourceMappingURL=TrackingBox.js.map