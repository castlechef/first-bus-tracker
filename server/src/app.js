"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var buses_1 = require("./routes/buses");
var buses_2 = require("./models/buses");
exports.app = express();
exports.buses = new buses_2.Buses();
exports.app.locals.buses = exports.buses;
exports.app.use(bodyParser.json());
exports.app.use('/buses', buses_1["default"]);
var A = (function (_super) {
    __extends(A, _super);
    function A() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return A;
}(Error));
