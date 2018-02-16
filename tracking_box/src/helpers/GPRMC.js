"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GPSPosition_1 = require("../GPSPosition");
class GPRMC {
    parse(tokens, position) {
        position.time = parseFloat(tokens[1]);
        position.lat = GPSPosition_1.GPSPosition.latitudeToDecimal(tokens[3], tokens[4]);
        position.lon = GPSPosition_1.GPSPosition.longitudeToDecimal(tokens[5], tokens[6]);
        position.velocity = parseFloat(tokens[7]);
        position.dir = parseFloat(tokens[8]);
    }
}
exports.GPRMC = GPRMC;
//# sourceMappingURL=GPRMC.js.map