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
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server-provider';
import { BusStopPage } from '../bus-stop/bus-stop';
/**
 * Generated class for the BusStopListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var BusStopListPage = (function () {
    function BusStopListPage(navCtrl, navParams, viewctrl, modalctrl, serverService) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewctrl = viewctrl;
        this.modalctrl = modalctrl;
        this.serverService = serverService;
        this.title = "Bus Stops";
        //navParams : stopId stopName
        this.busStops = [];
        this.serverService.getStopInfo('').then(function (array) {
            _this.busStops = array;
        }, function (err) {
            console.log('error getting bus stops', err.message);
            _this.busStops = [];
        });
    }
    BusStopListPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad BusStopPage');
    };
    BusStopListPage.prototype.closeModal = function () {
        this.viewctrl.dismiss();
    };
    BusStopListPage.prototype.openBusStop = function (busStop) {
        var tryModal = this.modalctrl.create(BusStopPage, { stopId: busStop.busStopId, stopName: busStop.busStopName });
        tryModal.present();
    };
    BusStopListPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-bus-stop-list',
            templateUrl: 'bus-stop-list.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, ViewController, ModalController, ServerProvider])
    ], BusStopListPage);
    return BusStopListPage;
}());
export { BusStopListPage };
//# sourceMappingURL=bus-stop-list.js.map