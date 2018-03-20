import {BusRouteName} from './busStops';
import {BusStop} from './busStop';

export type BusRoute = {
    busRouteName: BusRouteName;
    busStops: BusStop[];
}
