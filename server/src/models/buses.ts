import {Bus} from './bus';
import {Location} from './location';
import {Jsonable} from './response';

export class Buses implements Jsonable {
    private busList: Bus[];
    private currentId: number;

    constructor() {
        this.busList = [];
        this.currentId = 0;
    }

    public constainsBus(id: number): boolean {
        for (let i = 0; i < this.busList.length; i++) {
            let bus = this.busList[i];
            if (bus.id === id) return true;
        }
        return false;
    }

    public newBus(location: Location): Bus {
        const id = this.generateBusId();
        const bus = new Bus(id, location);
        this.busList.push(bus);
        return bus;
    }

    public removeAllBuses(): void {
        while (this.busList.length > 0) {
            this.busList.pop();
        }
        this.currentId = 0;
    }

    public toJson(): object {
        const jsonList = [];
        for (let i = 0; i < this.busList.length; i++) {
            jsonList.push(this.busList[i].toJson());
        }
        return jsonList;
    }

    private generateBusId(): number {
        return this.currentId++;
    }
}
