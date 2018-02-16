import { GPSentenceCode } from "./GPSentenceCode";

export class GPRMZ implements GPSentenceCode {
    parse(tokens, position) {
        position.altitude = parseFloat(tokens[1]);
    }
}