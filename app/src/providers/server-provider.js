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
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import { Events } from 'ionic-angular';
var ServerProvider = (function () {
    function ServerProvider(http, events) {
        this.http = http;
        this.events = events;
        // url for the api where the data is coming from
        //private _url: string = 'http://localhost:8080/';
        this._url = "http://10.0.0.4:" + 8080 + "/";
        console.log('starting a new server provider now!');
        this.buses = [];
        this.startBusFetchingBuses();
        this.id = Math.random();
    }
    ServerProvider.prototype.ngOnDestroy = function () {
        console.log('being destroyed');
        clearInterval(this.busInterval);
    };
    ServerProvider.prototype.startBusFetchingBuses = function () {
    };
    // gets buses data and maps it to the observable Bus
    ServerProvider.prototype.getBusLocations = function () {
        return this.buses;
    };
    ServerProvider.prototype.getBusStopLocations = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http
                .get(_this._url.concat('busStops'))
                .toPromise().then(function (body) {
                resolve(body.data);
            }).catch(function (e) {
                reject(e);
            });
        });
    };
    ServerProvider.prototype.getBusInfo = function (number) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http
                .get(_this._url.concat('buses/' + number))
                .toPromise()
                .then(function (body) {
                resolve(body.data);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    ServerProvider.prototype.getStopInfo = function (number) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http
                .get(_this._url.concat('busStops/' + number))
                .toPromise()
                .then(function (body) {
                resolve(body.data);
            })
                .catch(function (e) {
                reject(e.message);
            });
        });
    };
    ServerProvider.prototype.getStops = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http
                .get(_this._url.concat('busStops/'))
                .toPromise()
                .then(function (body) {
                resolve(body.data);
            })
                .catch(function (e) {
                reject(e.message);
            });
        });
    };
    ServerProvider.prototype.setCapacity = function (busId, capacity) {
        console.log("attempting to set capacity:", capacity, "bus id:", busId);
        var url = this._url.concat('buses/', busId, '/capacity');
        console.log(url);
        this.http.put(url, capacity).toPromise().then(function (body) {
            console.log(body);
        }, function (error) {
            console.log("This didn't work:", error);
        });
    };
    ServerProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Events])
    ], ServerProvider);
    return ServerProvider;
}());
export { ServerProvider };
//# sourceMappingURL=server-provider.js.map