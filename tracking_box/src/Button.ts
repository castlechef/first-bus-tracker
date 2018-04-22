import * as onoff from 'onoff';
import {EventEmitter} from 'events';

const Gpio = onoff.Gpio;

export enum BUTTON_STATE {
    DOWN = 1,
    UP = 0,
    UNKNOWN = -1
}

export class Button {
    private button: any;
    private events: EventEmitter;
    private latestState: BUTTON_STATE;
    private state: BUTTON_STATE;
    private lastDown: number;
    private static readonly BUTTON_DEBOUNCE = 250;
    private static readonly EVENTS = {
        STATE_CHANGED: 'state-changed',
        BUTTON_PRESSED: 'button-pressed'
    };

    constructor(pin: number) {
        function debounce(fun, mil){
            var timer;
            return function(){
                clearTimeout(timer);
                timer = setTimeout(function(){
                    fun();
                }, mil);
            };
        }

        this.button = new Gpio(pin, 'in', 'both');
        this.button.watch(this.handleWatchEvent.bind(this));
        this.events.on(Button.EVENTS.STATE_CHANGED, (state) => {
            this.state = state;
            console.log(state);
        });
    }

    private handleWatchEvent(err: Error, state: number): void {
        if (err) throw err;

        if (state === BUTTON_STATE.DOWN) {
            if (Date.now() - this.lastDown > Button.BUTTON_DEBOUNCE) {
                console.log('PRESSED!');
                this.events.emit(Button.EVENTS.BUTTON_PRESSED)
            }
            this.lastDown = Date.now();
        }
    }

    public waitForPress(): Promise<void> {
        return new Promise<void>(resolve => {
            this.events.once(Button.EVENTS.BUTTON_PRESSED, () => {
                resolve();
            });
        });
    }

    public closeButton() {
        this.button.unexport();
    }
}