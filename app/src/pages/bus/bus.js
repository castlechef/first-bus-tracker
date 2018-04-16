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
var BusPage = (function () {
    function BusPage(navCtrl, navParams, viewctrl, serverService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewctrl = viewctrl;
        this.serverService = serverService;
        this.title = "Bus";
        this.capacities = [{
                "data": {
                    "capacity": "UNKNOWN"
                }
            }, {
                "data": {
                    "capacity": "EMPTY"
                }
            }, {
                "data": {
                    "capacity": "QUIET"
                }
            }, {
                "data": {
                    "capacity": "BUSY"
                }
            }, {
                "data": {
                    "capacity": "FULL"
                }
            }];
        this.capacityInput = true;
        this.title = navParams.get('routeName');
        this.busId = navParams.get('busId');
        this.getBusInfo(navParams.get('busId')).then(function (busInfo) {
            _this.nextBusStops = busInfo.arrivalTimes;
            _this.capacity = busInfo.capacity;
        }, function (rejected) {
            console.log(rejected);
            _this.capacity = "UNKNOWN";
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
    BusPage.prototype.infoUpdater = function () {
        var _this = this;
        setInterval(function () {
            _this.getBusInfo(_this.busId).then(function (busInfo) {
                _this.nextBusStops = busInfo.arrivalTimes;
                _this.capacity = busInfo.capacity;
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
        this.capacity = this.capacities[number].data.capacity;
        this.serverService.setCapacity(this.busId, this.capacities[number]);
    };
    BusPage.prototype.closeCapacity = function () {
        this.capacityInput = false;
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