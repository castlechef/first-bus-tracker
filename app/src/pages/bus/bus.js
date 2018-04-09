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
/**
 * Generated class for the BusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var BusPage = (function () {
    function BusPage(navCtrl, navParams, viewctrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewctrl = viewctrl;
        this.title = "Bus";
        this.exampleBusStops = {
            "routeName": "U1X",
            "location": {
                "latitude": 51.368600,
                "longitude": -2.336717
            },
            "nextBusStops": [
                { "busStopId": 1, "busStopName": "Arrival's Square (Stop A)", "expectedArrival": "09:23" },
                { "busStopId": 5, "busStopName": "Youth Hostel", "expectedArrival": "10:11" }
            ],
            "capacity": 0
        }; //doaihdoaisdnaso
        this.title = navParams.get('routeName');
        this.nextBusStops = [
            { busStopId: 1, busStopName: "Arrival's Square (Stop A)", expectedArrival: "09:23" },
            { busStopId: 5, busStopName: "Youth Hostel", expectedArrival: "10:11" }
        ];
    }
    BusPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad BusPage');
    };
    BusPage.prototype.closeModal = function () {
        this.viewctrl.dismiss();
    };
    BusPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-bus',
            templateUrl: 'bus.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, ViewController])
    ], BusPage);
    return BusPage;
}());
export { BusPage };
//# sourceMappingURL=bus.js.map