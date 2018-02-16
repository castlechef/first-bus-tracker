"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GPSSensor_1 = require("./GPSSensor");
const gpsSensor = new GPSSensor_1.GPSSensor();
gpsSensor.on('location', location => {
    console.log(location);
});
//# sourceMappingURL=app.js.map