"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GPSPosition_1 = require("../GPSPosition");
class GPGGL {
    parse(tokens, position) {
        position.lat = GPSPosition_1.GPSPosition.latitudeToDecimal(tokens[1], tokens[2]);
        position.lon = GPSPosition_1.GPSPosition.longitudeToDecimal(tokens[3], tokens[4]);
        position.time = parseFloat(tokens[5]);
    }
}
exports.GPGGL = GPGGL;
//# sourceMappingURL=GPGGL.js.map