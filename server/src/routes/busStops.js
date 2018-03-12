"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const response_1 = require("../models/response");
const app_1 = require("../app");
const router = express.Router();
router.get('/', (req, res) => {
    let responseData;
    try {
        res.status(200);
        responseData = response_1.Response.factory(true, app_1.app.locals.busStops.toJSON());
    }
    catch (e) {
        res.status(503);
        responseData = response_1.Response.factory(false, undefined, 503);
    }
    finally {
        res.json(responseData);
    }
});
exports.default = router;
//# sourceMappingURL=busStops.js.map