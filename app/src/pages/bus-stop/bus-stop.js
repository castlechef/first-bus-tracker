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
import { ViewController, IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { BusPage } from '../bus/bus';
import { ServerProvider } from '../../providers/server-provider';
/**
 * Generated class for the BusStopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var BusStopPage = (function () {
    function BusStopPage(navCtrl, navParams, viewctrl, modalctrl, serverService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewctrl = viewctrl;
        this.modalctrl = modalctrl;
        this.serverService = serverService;
        this.title = "Bus Stop";
        //navParams : stopId stopName
        this.title = navParams.get('stopName');
        this.getBusStopData(navParams.get('stopId')).then(function (array) {
            _this.buses = array;
        }, function (rejected) {
            _this.buses = [];
            console.log(rejected);
        }); /*[
          { busRoute: 'U1', arrivalTime: "09:50", busId: 1},
          { busRoute: 'U1X', arrivalTime: "09:53", busId: 2}//oiihADXINA
        ];*/
    }
    BusStopPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad BusStopPage');
    };
    BusStopPage.prototype.closeModal = function () {
        this.viewctrl.dismiss();
    };
    BusStopPage.prototype.getBusStopData = function (stopId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.serverService.getStopInfo(stopId).then(function (data) {
                resolve(data.data.arrivals);
            }, function (rejected) {
                reject(rejected);
            });
        });
    };
    BusStopPage.prototype.openBus = function (bus) {
        var tryModal = this.modalctrl.create(BusPage, { busId: bus.busId, routeName: bus.busRoute });
        tryModal.present();
    };
    BusStopPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-bus-stop',
            templateUrl: 'bus-stop.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, ViewController, ModalController, ServerProvider])
    ], BusStopPage);
    return BusStopPage;
}());
export { BusStopPage };
//# sourceMappingURL=bus-stop.js.map