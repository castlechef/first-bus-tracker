import {Bus, busId} from './bus';
import {Location} from './location';
import {Jsonable} from './response';
import {IdGenerator} from '../utils/id';

export class Buses implements Jsonable {
    private busList: Bus[];
    private busMap: Map<busId, Bus>;
    private currentId: busId;
    private idGenerator: IdGenerator;

    constructor() {
        this.busList = [];
        this.busMap = new Map<busId, Bus>();
        this.idGenerator = new IdGenerator();
    }

    public containsBus(id: busId): boolean {
        //return this.busMap.has(id);
        return this.busList.some(bus => bus.id === id);
    }

    public getBus(id: busId): Bus {
        //const bus = this.busMap.get(id);
        const bus = this.busList.find(bus => bus.id === id);
        if (!bus) throw new Error('Bus not found');
        return bus;
    }

    public createAndInsertBus(location: Location): Bus {
        const id = this.idGenerator.getNextId();
        const bus = new Bus(id, location);
        this.busList.push(bus);
        //this.busMap.set(id, bus);
        return bus;
    }

    public removeBus(id: busId): void {
        if (!this.containsBus(id)) throw new Error('bus not found');
        //this.busMap.delete(id);
        this.busList.splice(this.busList.indexOf(this.busList.find(bus => bus.id === id)), 1)
    }

    public removeAllBuses(): void {
        while (this.busList.length > 0) {
            this.busList.pop();
        }
        this.idGenerator.resetIds();
        //this.busMap.clear();
    }

    public toJson(): object {
        const jsonList = [];
        //this.busMap.forEach(bus => jsonList.push(bus.toJson()));
        for (let i = 0; i < this.busList.length; i++) {
            jsonList.push(this.busList[i].toJson());
        }
        return jsonList;
    }
}
