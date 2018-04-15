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
        this.title = navParams.get('routeName');
        this.getBusInfo(navParams.get('busId')).then(function (busInfo) {
            _this.nextBusStops = busInfo;
        }, function (rejected) {
            console.log(rejected);
            _this.nextBusStops = [];
        });
    }
    BusPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ' + this.nextBusStops);
    };
    BusPage.prototype.closeModal = function () {
        this.viewctrl.dismiss();
    };
    BusPage.prototype.getBusInfo = function (busId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.serverService.getBusInfo(busId).then(function (data) {
                var gotten = data.arrivalTimes;
                resolve(gotten);
            }, function (rejected) {
                reject(rejected);
            });
        });
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