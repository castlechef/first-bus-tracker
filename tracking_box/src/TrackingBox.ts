import {Button} from './Button';
import {Display, DisplayOptions} from './Display';

export class TrackingBox {
    private display: Display;
    private button1: Button;    // select
    private button2: Button;    // next/cancel
    private busRoute: BusRoute;

    constructor(displayOpts: DisplayOptions, buttonPin1: number, buttonPin2: number) {
        this.display = new Display(displayOpts);
        this.button1 = new Button(buttonPin1);
        this.button2 = new Button(buttonPin2);
        this.busRoute = new BusRoute();
    }

    public async start() {
        // STEPS:
        // get route
        // select start / cancel
        // show route, cancel
        // on error, cancel
        // loop
        console.log('TrackingBox - start');
        await this.init();
        try {
            while (true) {
                await this.loop();
            }
        } catch(e) {
            console.log('Error in loop!');
            this.exit();
            console.log(e.message);
        }
    }

    private async loop() {
        console.log('TrackingBox - loop');
        let busRoute: string;
        do {
            console.log('TrackingBox - loop, awaiting busRoute selection');
            busRoute = await this.getBusRouteSelection();
            console.log('TrackingBox - have busRoute selection: ' + busRoute);
        } while (!await this.confirmStart(busRoute));
        console.log('TrackingBox - have confirmed bus route ' + busRoute);
        do {
            console.log('TrackingBox - awaiting route start');
            await this.startRoute(busRoute);
        } while (!await this.confirmCancel(busRoute));
        console.log('TrackingBox - cancel pressed');
        await this.waitForCancel();
    }

    private async init() {
        await this.display.started();
    }

    private async getBusRouteSelection(): Promise<string> {
        await this.showStartingOption();
        do {
            await this.showBusRouteOption(this.busRoute.currentRoute);
            this.busRoute.getNextRoute();
        } while (await this.waitForButtonPress() === this.button2);
        return this.busRoute.currentRoute;
    }

    private async showStartingOption(): Promise<void> {
        const message = 'Select a route:';
        await this.display.writeMessage(0, Display.ROW.TOP, message);
    }

    private async showBusRouteOption(busRoute: string): Promise<void> {
        await this.display.writeMessage(0, Display.ROW.BOTTOM, busRoute);
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
            'CONFIRM / CANCEL'
        ];
        await this.display.writeMessage(0, Display.ROW.TOP, message[0]);
        await this.display.writeMessage(0, Display.ROW.BOTTOM, message[1]);
        const button: Button = await this.waitForButtonPress();
        return button === this.button1;
    }

    private async startRoute(busRoute: string): Promise<void> {
        await this.display.writeMessage(0, Display.ROW.TOP, `Started ${busRoute}`);
        await this.display.writeMessage(0, Display.ROW.BOTTOM, 'Press to cancel');
    }

    private async waitForCancel(): Promise<void> {
        return this.button2.waitForPress();
    }

    private async confirmCancel(routeName: string): Promise<boolean> {
        await this.display.writeMessage(0, Display.ROW.TOP, 'Confirm cancel');
        await this.display.writeMessage(0, Display.ROW.BOTTOM, `route ${routeName}`);
        const button: Button = await this.waitForButtonPress();
        return button === this.button2;
    }

    public exit(): void {
        this.display.closeLcd();
        this.button1.closeButton();
        this.button2.closeButton();
    }
}

export class BusRoute {
    private static readonly ROUTES = ['U1', 'U1X', 'U2'];

    private currentIndex;

    constructor() {
        this.currentIndex = 0;
    }

    get currentRoute(): string {
        return BusRoute.ROUTES[this.currentIndex];
    }

    public getNextRoute(): string {
        return BusRoute.ROUTES[this.currentIndex++];
    }
}