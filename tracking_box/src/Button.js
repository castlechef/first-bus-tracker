"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onoff = require("onoff");
const events_1 = require("events");
const Gpio = onoff.Gpio;
var BUTTON_STATE;
(function (BUTTON_STATE) {
    BUTTON_STATE[BUTTON_STATE["DOWN"] = 1] = "DOWN";
    BUTTON_STATE[BUTTON_STATE["UP"] = 0] = "UP";
    BUTTON_STATE[BUTTON_STATE["UNKNOWN"] = -1] = "UNKNOWN";
})(BUTTON_STATE = exports.BUTTON_STATE || (exports.BUTTON_STATE = {}));
class Button {
    constructor(pin) {
        function debounce(fun, mil) {
            var timer;
            return function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fun();
                }, mil);
            };
        }
        this.events = new events_1.EventEmitter();
        this.button = new Gpio(pin, 'in', 'both');
        this.button.watch(this.handleWatchEvent.bind(this));
        this.events.on(Button.EVENTS.STATE_CHANGED, (state) => {
            this.state = state;
            console.log(state);
        });
    }
    handleWatchEvent(err, state) {
        if (err)
            throw err;
        if (state === BUTTON_STATE.DOWN) {
            if (Date.now() - this.lastDown > Button.BUTTON_DEBOUNCE) {
                console.log('PRESSED!');
                this.events.emit(Button.EVENTS.BUTTON_PRESSED);
            }
            this.lastDown = Date.now();
        }
    }
    waitForPress() {
        return new Promise(resolve => {
            this.events.once(Button.EVENTS.BUTTON_PRESSED, () => {
                resolve();
            });
        });
    }
    closeButton() {
        this.button.unexport();
    }
}
Button.BUTTON_DEBOUNCE = 250;
Button.EVENTS = {
    STATE_CHANGED: 'state-changed',
    BUTTON_PRESSED: 'button-pressed'
};
exports.Button = Button;
//# sourceMappingURL=Button.js.map