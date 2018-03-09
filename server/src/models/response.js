"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTTPStatusCodes = require("http-status-codes");
class Response {
    static factory(success, data, errorCode) {
        const status = success ? 'success' : 'failure';
        const res = {
            status,
            data,
        };
        if (errorCode) {
            res.error = {
                code: errorCode,
                message: HTTPStatusCodes.getStatusText(errorCode),
            };
        }
        return res;
    }
}
exports.Response = Response;
//# sourceMappingURL=response.js.map