var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/*
  Generated class for the BusRouteProvider provider.
*/
var BusRouteProvider = (function () {
    function BusRouteProvider(http) {
        this.http = http;
        this.hasReceivedData = false;
    }
    BusRouteProvider_1 = BusRouteProvider;
    BusRouteProvider.prototype.getBusRoutes = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.ensureHasData()
                .then(function () {
                resolve(_this.busRoutes);
            })
                .catch(function (err) {
                console.log("Error in getBusRoutes", err);
                reject(err);
            });
        });
    };
    BusRouteProvider.prototype.getSections = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.ensureHasData()
                .then(function () {
                resolve(_this.sections);
            })
                .catch(function (err) {
                console.log("Error in getSections", err);
                reject(err);
            });
        });
    };
    BusRouteProvider.prototype.ensureHasData = function () {
        if (this.hasReceivedData) {
            return new Promise(function (resolve) { return resolve(); });
        }
        else {
            return this.updateDataFromServer();
        }
    };
    BusRouteProvider.prototype.updateDataFromServer = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(BusRouteProvider_1.URL).toPromise().then(function (data) {
                var body = data;
                if (body.status === 'success') {
                    _this.sections = body.data.sections;
                    _this.busRoutes = body.data.busRoutes;
                    _this.hasReceivedData = true;
                    resolve();
                }
                else {
                    reject();
                }
            }).catch(function (error) {
                reject();
            });
        });
    };
    BusRouteProvider.URL = "http://10.0.0.4:" + 8080 + "/busRoutes";
    BusRouteProvider = BusRouteProvider_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], BusRouteProvider);
    return BusRouteProvider;
    var BusRouteProvider_1;
}());
export { BusRouteProvider };
//# sourceMappingURL=bus-route.js.map