import {Button} from './Button';
import {Display, DisplayOptions} from './Display';
import {GPSSensor} from './GPSSensor';
import {GPSPosition} from './GPSPosition';
import {EventEmitter} from 'events';
import fetch from 'node-fetch';
import * as rp from 'request-promise';

export class TrackingBox {
    private tracker: BusLocationTracker;
    private display: Display;
    private button1: Button;    // select
    private button2: Button;    // next/cancel
    private busRoute: BusRoute;

    constructor(displayOpts: DisplayOptions, buttonPin1: number, buttonPin2: number) {
        this.tracker = new BusLocationTracker();
        this.display = new Display(displayOpts);
        this.button1 = new Button(buttonPin1);
        this.button2 = new Button(buttonPin2);
        this.busRoute = new BusRoute();
    }

    public async start() {
        await this.init();
        try {
            while (true) {
                await this.loop();
            }
        } catch (e) {
            console.log('Error in main loop', e.message);
            this.exit();
        }
    }

    private async loop() {
        let busRoute: string;

        do {
            busRoute = await this.getBusRouteSelection();
        } while (!await this.confirmStart(busRoute));

        this.tracker.startNewRoute(busRoute);
        do {
            await this.startRoute(busRoute);
            await this.waitForCancel();
        } while (!await this.definitelyWantsToCancel(busRoute));
        this.tracker.stopCurrentRoute();
    }

    private async init() {
        await this.display.started();
    }

    private async getBusRouteSelection(): Promise<string> {
        await this.showStartingOption();
        let route: string;
        do {
            if (route) this.busRoute.getNextRoute();
            route = this.busRoute.currentRoute;
            await this.showBusRouteOption(route);
        } while (await this.waitForButtonPress() === this.button2);
        return route;
    }

    private async showStartingOption(): Promise<void> {
        const message = 'Select a route:';
        await this.display.writeMessage(0, Display.ROW.TOP, message);
    }

    private async showBusRouteOption(busRoute: string): Promise<void> {
        await this.display.writeMessage(0, Display.ROW.BOTTOM, busRoute + '             ');
    }

    private waitForButtonPress(): Promise<Button> {
        return new Promise<Button>(resolve => {
            let resolved: boolean = false;
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

    private async confirmStart(busRoute: string): Promise<boolean> {
        const message: [string, string] = [
            `ROUTE: ${busRoute}`,
            'CONFIRM   CANCEL'
        ];
        await this.display.writeMessage(0, Display.ROW.TOP, message[1]);
        await this.display.writeMessage(0, Display.ROW.BOTTOM, message[0]);
        const button: Button = await this.waitForButtonPress();
        return button === this.button1;
    }

    private async startRoute(busRoute: string): Promise<void> {
        await this.display.writeMessage(0, Display.ROW.TOP, '          CANCEL');
        await this.display.writeMessage(0, Display.ROW.BOTTOM, `Started ${busRoute}`);
    }

    private async waitForCancel(): Promise<void> {
        return this.button2.waitForPress();
    }

    private async definitelyWantsToCancel(routeName: string): Promise<boolean> {
        await this.display.writeMessage(0, Display.ROW.TOP, 'CONFIRM   CANCEL');
        await this.display.writeMessage(0, Display.ROW.BOTTOM, `Stop route: ${routeName}?`);
        const button: Button = await this.waitForButtonPress();
        return button.pin === this.button1.pin;
    }

    public exit(): void {
        this.display.closeLcd();
        this.button1.closeButton();
        this.button2.closeButton();
    }
}

export class BusRoute {
    private static readonly ROUTES = ['U1 ', 'U1X', 'U2 '];

    private currentIndex;

    constructor() {
        this.currentIndex = 0;
    }

    get currentRoute(): string {
        return BusRoute.ROUTES[this.currentIndex];
    }

    public getNextRoute(): string {
        this.incrementRoute();
        return BusRoute.ROUTES[this.currentIndex];
    }

    private incrementRoute(): void {
        this.currentIndex++;
        this.currentIndex %= BusRoute.ROUTES.length;
    }
}

export class BusLocationTracker {
    private static readonly HOST_URL = 'http://firstbustracker.ddns.net/api';
    //private static readonly HOST_URL = 'http://192.168.0.58/api';

    private gpsSensor: GPSSensor;
    private latestPosition: GPSPosition;
    private events: EventEmitter;
    private busId: number;

    constructor() {
        this.events = new EventEmitter();
        this.gpsSensor = new GPSSensor();
        this.gpsSensor.on('position', this.handlePositionUpdate.bind(this));
    }

    private handlePositionUpdate(position: GPSPosition): void {
        if (typeof position.lat !== 'number' || isNaN(position.lat)) {
            position.lat = 51.380901;
            position.lon = -2.354876;
        }
        this.latestPosition = position;
        this.events.emit('position-updated');
    }

    public startNewRoute(busRoute: string) {
        this.start(busRoute).catch(e => {
            console.log('error in loop', e.message);
        });
    }

    private async start(busRoute: string): Promise<void> {
        await this.ensureHasPosition();
        const busId = await this.postNewBus(busRoute);
        if (!busId) {
            throw new Error('FUCK');
        } else {
            this.busId = busId;
            let success: boolean;
            let stop = false;
            this.events.once('stopping', () => {
                stop = true;
            });
            do {
                await this.newPositionFromSensor();
                if (stop) return;
                success = await this.putNewPosition();
                console.log('PUT SUCCESS: ' + success);
            } while (this.latestPosition !== undefined || stop);
            console.log('exiting loop');
        }
    }

    private ensureHasPosition(): Promise<void> {
        return new Promise<void>(resolve => {
            if (this.latestPosition) {
                resolve();
            } else {
                this.events.once('position-updated', () => {
                    resolve();
                });
            }
        });
    }

    private async postNewBus(busRoute: string): Promise<number> {
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
            const json = await rp(opts);
            const busId = (json && json.data && json.data.busId);
            console.log(json);
            if (busId) {
                return busId;
            } else {
                throw new Error('fuck.');
            }
        } catch (e) {
            console.log('Error posting bus', e.message);
        }
    }

    private async putNewPosition(): Promise<boolean> {
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
            const json = await rp(opts);
            if (json && json.status && json.status === 'success') {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log('Error putting data...', e.message);
            return false;
        }
    }

    private newPositionFromSensor(): Promise<GPSPosition> {
        return new Promise<GPSPosition>(resolve => {
            this.events.once('position-updated', () => {
                resolve(this.latestPosition);
            });
        });
    }

    public stopCurrentRoute() {
        this.latestPosition = undefined;
        this.events.emit('stopping');
    }


}