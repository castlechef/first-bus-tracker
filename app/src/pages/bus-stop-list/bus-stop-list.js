var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server-provider';
import { BusStopPage } from '../bus-stop/bus-stop';
import { SettingsProvider } from '../../providers/settings/settings';
/**
 * Generated class for the BusStopListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var BusStopListPage = (function () {
    function BusStopListPage(navCtrl, navParams, viewctrl, modalctrl, serverService, alertCtrl, settings) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewctrl = viewctrl;
        this.modalctrl = modalctrl;
        this.serverService = serverService;
        this.alertCtrl = alertCtrl;
        this.settings = settings;
        this.title = 'Bus Stops';
        //navParams : stopId stopName
        this.busStops = [];
        this.serverService.getStops()
            .then(function (array) {
            _this.busStops = array;
            _this.setupBusStops();
            _this.setupFavs();
        }, function (err) {
            console.log('error getting bus stops', err.message);
            _this.busStops = [];
        });
    }
    BusStopListPage.prototype.setupBusStops = function () {
        this.busStops = this.busStops.sort(function (s1, s2) { return s1.busStopName > s2.busStopName ? 1 : -1; });
        this.setupFavs();
        var favs = this.busStops.filter(function (_a) {
            var isFav = _a.isFav;
            return isFav;
        });
        var nonFavs = this.busStops.filter(function (_a) {
            var isFav = _a.isFav;
            return !isFav;
        });
        nonFavs.forEach(function (e) { return favs.push(e); });
        this.busStops = favs;
    };
    BusStopListPage.prototype.setupFavs = function () {
        var favs = this.settings.getFavourites();
        this.busStops.forEach(function (busStop) {
            if (favs.indexOf(busStop.busStopName) !== -1) {
                busStop.isFav = true;
            }
        });
    };
    BusStopListPage.prototype.ionViewWillEnter = function () {
        this.viewctrl.showBackButton(false);
    };
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
    BusStopListPage.prototype.presentConfirm = function (busStop) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Confirm favourite',
            message: "Are you sure you want to " + (busStop.isFav ? 'remove' : 'add') + " " + busStop.busStopName + " as a favourite?",
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Confirm',
                    handler: function () {
                        _this.doAThing(busStop);
                    }
                }
            ]
        });
        alert.present();
    };
    BusStopListPage.prototype.doAThing = function (busStop) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('eaayhhhhhh added!');
                        if (!busStop.isFav) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.settings.removeFavouriteStop(busStop.busStopName)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.settings.addFavouriteStop(busStop.busStopName)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        busStop.isFav = !busStop.isFav;
                        this.setupBusStops();
                        return [2 /*return*/];
                }
            });
        });
    };
    BusStopListPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-bus-stop-list',
            templateUrl: 'bus-stop-list.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ViewController,
            ModalController,
            ServerProvider,
            AlertController,
            SettingsProvider])
    ], BusStopListPage);
    return BusStopListPage;
}());
export { BusStopListPage };
//# sourceMappingURL=bus-stop-list.js.map