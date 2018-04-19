var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServerProvider } from '../../providers/server-provider';
/**
 * Generated class for the BusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var capacities;
(function (capacities) {
    capacities[capacities["UNKNOWN"] = 0] = "UNKNOWN";
    capacities[capacities["EMPTY"] = 1] = "EMPTY";
    capacities[capacities["QUIET"] = 2] = "QUIET";
    capacities[capacities["BUSY"] = 3] = "BUSY";
    capacities[capacities["FULL"] = 4] = "FULL";
})(capacities || (capacities = {}));
var BusPage = (function () {
    function BusPage(navCtrl, navParams, viewctrl, serverService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewctrl = viewctrl;
        this.serverService = serverService;
        this.title = 'Bus';
        this.capacityInput = true;
        this.capacityShown = false;
        this.title = navParams.get('routeName');
        this.busId = navParams.get('busId');
        this.getBusInfo(navParams.get('busId')).then(function (busInfo) {
            console.log(busInfo);
            _this.nextBusStops = busInfo.arrivalTimes;
            _this.capacity = busInfo.capacity;
            if (_this.distanceClose(busInfo.location, { latitude: 0.0, longitude: 0.0 })) {
                _this.capacityInput = true;
            }
            else {
                _this.writeCapacityDisplay(busInfo.capacity);
            }
        }, function (rejected) {
            console.log(rejected);
            _this.capacity = "UNKNOWN";
            _this.writeCapacityDisplay("UNKNOWN");
            _this.nextBusStops = [];
        });
        this.infoUpdater();
    }
    BusPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ' + this.nextBusStops);
    };
    BusPage.prototype.closeModal = function () {
        this.viewctrl.dismiss();
    };
    BusPage.prototype.distanceClose = function (busPosition, userPosition) {
        function toRadians(n) { return n * Math.PI / 180; }
        var R = 6371e3;
        var theta1 = toRadians(busPosition.latitude);
        var theta2 = toRadians(userPosition.latitude);
        var deltaTheta = toRadians(userPosition.latitude - busPosition.latitude);
        var deltaLamda = toRadians(userPosition.longitude - busPosition.longitude);
        var a = (Math.pow(Math.sin(deltaTheta / 2), 2)) + (Math.cos(theta1) * Math.cos(theta2) * (Math.pow(Math.sin(deltaLamda / 2), 2)));
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c < 50;
    };
    BusPage.prototype.infoUpdater = function () {
        var _this = this;
        setInterval(function () {
            _this.getBusInfo(_this.busId).then(function (busInfo) {
                _this.nextBusStops = busInfo.arrivalTimes;
                _this.capacity = busInfo.capacity;
                _this.writeCapacityDisplay(busInfo.capacity);
            }, function (rejected) {
                console.log(rejected);
            });
        }, 1000);
    };
    BusPage.prototype.getBusInfo = function (busId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.serverService.getBusInfo(busId).then(function (data) {
                resolve(data);
            }, function (rejected) {
                reject(rejected);
            });
        });
    };
    BusPage.prototype.inputCapacity = function (number) {
        this.sub_capacity = capacities[number];
    };
    BusPage.prototype.submitCapacity = function () {
        this.serverService.setCapacity(this.busId, this.sub_capacity);
        this.capacityInput = false;
        this.writeCapacityDisplay(this.capacity);
    };
    BusPage.prototype.dismissCapacity = function () {
        this.writeCapacityDisplay(this.capacity);
        this.capacityInput = false;
    };
    BusPage.prototype.writeCapacityDisplay = function (capacity) {
        switch (capacity) {
            case "EMPTY":
                this.capacityDisplay = "This bus is empty";
                this.capacityShown = true;
                break;
            case "QUIET":
                this.capacityDisplay = "This bus is quiet";
                this.capacityShown = true;
                break;
            case "BUSY":
                this.capacityDisplay = "This bus is busy";
                this.capacityShown = true;
                break;
            case "FULL":
                this.capacityDisplay = "This bus is full";
                this.capacityShown = true;
                break;
            default:
                this.capacityDisplay = "";
                this.capacityShown = false;
        }
    };
    BusPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-bus',
            templateUrl: 'bus.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, ViewController, ServerProvider])
    ], BusPage);
    return BusPage;
}());
export { BusPage };
//# sourceMappingURL=bus.js.map