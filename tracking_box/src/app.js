"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TrackingBox_1 = require("./TrackingBox");
/*const gpsSensor = new GPSSensor();

gpsSensor.on('location', location => {
    console.log(location);
});
*/
/*
rs - 25
e  - 24
d4 - 23
d5 - 22
d6 - 27
d7 - 17
*/
/*
b1 - 5
b2 - 6
 */
const displayOptions = {
    rs: 25,
    e: 24,
    data: [23, 22, 27, 17],
    cols: 16,
    rows: 2
};
const trackingBox = new TrackingBox_1.TrackingBox(displayOptions, 5, 6);
trackingBox.start();
//# sourceMappingURL=app.js.map