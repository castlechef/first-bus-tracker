"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HTTPStatusCodes = require("http-status-codes");
var Response = (function () {
    function Response() {
    }
    Response.factory = function (success, data, errorCode) {
        var status = success ? 'success' : 'failure';
        var res = {
            status: status,
            data: data,
        };
        if (errorCode) {
            res.error = {
                code: errorCode,
                message: HTTPStatusCodes.getStatusText(errorCode),
            };
        }
        return res;
    };
    return Response;
}());
exports.Response = Response;
