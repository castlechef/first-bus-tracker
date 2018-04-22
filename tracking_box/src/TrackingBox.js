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
            do {
                yield this.startRoute(busRoute);
                yield this.waitForCancel();
            } while (!(yield this.definitelyWantsToCancel(busRoute)));
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
//# sourceMappingURL=TrackingBox.js.map