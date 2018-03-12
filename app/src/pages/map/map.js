"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var MapPage = (function () {
    function MapPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        //const map = new google.maps.Map();
        /**/
    }
    MapPage.prototype.ionViewDidLoad = function () {
        console.log(this.mapElement);
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            center: new google.maps.LatLng(48.636111, -53.759722),
            zoom: 15,
            styles: [
                {
                    featureType: "transit.station.bus",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ]
        });
    };
    __decorate([
        core_1.ViewChild('map')
    ], MapPage.prototype, "mapElement");
    MapPage = __decorate([
        ionic_angular_1.IonicPage(),
        core_1.Component({
            selector: 'page-map',
            templateUrl: 'map.html'
        })
    ], MapPage);
    return MapPage;
}());
exports.MapPage = MapPage;
