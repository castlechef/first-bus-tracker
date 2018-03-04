import {Jsonable} from './response';
import {Location} from './location';
import {BusRouteName} from './busRoute';

export class BusStop implements Jsonable {
    private id: number;
    private name: string;
    private location: Location;
    private busRouteNames: BusRouteName[];

    constructor(id: number, name: string, location: Location, busRouteNames: BusRouteName[]) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.busRouteNames = busRouteNames;
    }

    public hasRoute(busRoute: BusRouteName): boolean {
        return this.busRouteNames.includes(busRoute);
    }

    public toJson(): object {
        return {
            busStopId: this.id,
            busStopName: this.name,
            location: this.location.toJson()
        }
    }

}