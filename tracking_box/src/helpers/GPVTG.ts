import { GPSentenceCode } from "./GPSentenceCode";

export class GPVTG implements GPSentenceCode {
    parse(tokens, position) {
        position.dir = parseFloat(tokens[3]);
    }
}