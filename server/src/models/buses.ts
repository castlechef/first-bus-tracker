import {Bus, busId} from './bus';
import {Location} from './location';
import {JSONable} from './response';
import {IdGenerator} from '../utils/id';
import {BusRouteName, BusStops} from './busStops';
import {BusStop} from './busStop';

export type BusArrival = {
    bus: Bus;
    arrivalTime: number; // in unix time
}

export class Buses implements JSONable {
    //private busMap: Map<busId, Bus>;
    public buses: Bus[];
    private idGenerator: IdGenerator;
    private busStops: BusStops

    constructor(busStops: BusStops) {
        if(!busStops) throw new Error('Creating Buses without a valid BusStops');
        //this.busMap = new Map<busId, Bus>();
        this.buses = [];
        this.idGenerator = new IdGenerator();
        this.busStops = busStops;
    }

    public containsBus(id: busId): boolean {
        return this.buses.some(b => b.id === id);
        //return this.busMap.has(id);
    }

    public getBus(id: busId): Bus {
        //const bus = this.busMap.get(id);
        const bus = this.buses.reduce((t, b) => t = (b.id === id) ? b : t, undefined);
        if (!bus) throw new Error('Bus not found');
        return bus;
    }

    public createAndInsertBus(location: Location, route: BusRouteName): Bus {
        if (!Location.isValidLocation(location) || !Buses.isValidBusRouteName(route)) throw new Error('Invalid bus');
        const id = this.idGenerator.getNextId();
        const bus = new Bus(id, location, route, this.busStops.getStopsWithRoute(route));
        //this.busMap.set(id, bus);
        this.buses.push(bus);
        return bus;
    }

    static isValidBusRouteName(route: any): boolean {
        for (let thing in BusRouteName) {
            if (BusRouteName[thing] === route) return true;
        }
        return false;
    }

    public removeBus(id: busId): void {
        if (!this.containsBus(id)) throw new Error('bus not found');
        //this.busMap.delete(id);
        let bus = this.getBus(id);
        this.buses.splice(this.buses.indexOf(bus), 1);
    }

    public removeAllBuses(): void {
        this.idGenerator.resetIds();
        //this.busMap.clear();
        this.buses = [];
    }

    public getExpectedArrivalsAtStop(busStop: BusStop): BusArrival[] {
        let a = this.buses
            .filter(b => b.hasStopPredictionReadyForStop(busStop))
            .map(b => {return {bus: b, arrivalTime: b.getPredictedArrival(busStop)}})
            .sort((b1, b2) => b1.arrivalTime > b2.arrivalTime ? 1 : -1);
        a.forEach(({arrivalTime}) => console.log('arrival time: ' + arrivalTime));

        return a;
    }



    public toJSON(): object {
        const jsonList = [];
        //this.busMap.forEach(bus => jsonList.push(bus.toJSON()));
        this.buses.forEach(bus => jsonList.push(bus.toJSON()));
        return jsonList;
    }
}
