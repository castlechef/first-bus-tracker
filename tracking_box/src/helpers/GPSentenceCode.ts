import {GPSPosition} from '../GPSPosition';

export interface GPSentenceCode {
    parse: (tokens: string[], position: GPSPosition) => void;
}
