"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const utils_1 = require("../utils/utils");
var RouteError = utils_1.Utils.routes.RouteError;
const router = express.Router();
router.get('/', (req, res, next) => {
    try {
        const data = require('../data/busRoutes.json');
        res.json({
            status: 'success',
            data
        });
    }
    catch (e) {
        next(RouteError.ServiceUnavailable());
    }
});
exports.default = router;
//# sourceMappingURL=busRoutes.js.map