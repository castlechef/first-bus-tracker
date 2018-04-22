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
        await this.init();
        try {
            while (true) {
                await this.loop();
            }
        } catch(e) {
            console.log('Error in main loop', e.message);
            this.exit();
        }
    }

    private async loop() {
        let busRoute: string;

        do {
            busRoute = await this.getBusRouteSelection();
        } while (!await this.confirmStart(busRoute));

        do {
            await this.startRoute(busRoute);
            await this.waitForCancel();
        } while (!await this.definitelyWantsToCancel(busRoute));
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