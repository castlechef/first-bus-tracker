import {Bus, busId} from './bus';
import {Location} from './location';
import {JSONable} from './response';
import {IdGenerator} from '../utils/id';
import {BusRouteName} from './busStops';

export class Buses implements JSONable {
    private busMap: Map<busId, Bus>;
    private idGenerator: IdGenerator;

    constructor() {
        this.busMap = new Map<busId, Bus>();
        this.idGenerator = new IdGenerator();
    }

    public containsBus(id: busId): boolean {
        return this.busMap.has(id);
    }

    public getBus(id: busId): Bus {
        const bus = this.busMap.get(id);
        if (!bus) throw new Error('Bus not found');
        return bus;
    }

    public createAndInsertBus(location: Location, route: BusRouteName): Bus {
        if (!Location.isValidLocation(location) || !Buses.isValidBusRouteName(route)) throw new Error('Invalid bus');
        const id = this.idGenerator.getNextId();
        const bus = new Bus(id, location, route);
        this.busMap.set(id, bus);
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
        this.busMap.delete(id);
    }

    public removeAllBuses(): void {
        this.idGenerator.resetIds();
        this.busMap.clear();
    }

    public toJSON(): object {
        const jsonList = [];
        this.busMap.forEach(bus => jsonList.push(bus.toJSON()));
        return jsonList;
    }
}
