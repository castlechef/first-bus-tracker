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
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
/*
  Generated class for the SettingsProvider provider.
*/
var SettingsProvider = (function () {
    function SettingsProvider(storage) {
        var _this = this;
        this.storage = storage;
        this.favouriteStops = [];
        this.storage
            .get('favourites')
            .then(function (favs) {
            console.log('favs', favs);
            if (favs === null) {
                _this.resetFavourites();
            }
            else {
                _this.favouriteStops = favs;
            }
        });
    }
    SettingsProvider.prototype.resetFavourites = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.storage.set('favourites', []);
                }
                catch (e) {
                    console.log('Error getting favourites :(', e.message);
                }
                return [2 /*return*/];
            });
        });
    };
    SettingsProvider.prototype.hasStop = function (stopName) {
        return this.favouriteStops.indexOf(stopName) !== -1;
    };
    SettingsProvider.prototype.addFavouriteStop = function (stopName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hasStop(stopName)) return [3 /*break*/, 1];
                        return [2 /*return*/, false];
                    case 1:
                        this.favouriteStops.push(stopName);
                        this.favouriteStops.sort();
                        return [4 /*yield*/, this.updateStoredFavourites()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    SettingsProvider.prototype.removeFavouriteStop = function (stopName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hasStop(stopName)) return [3 /*break*/, 2];
                        this.favouriteStops.splice(this.favouriteStops.indexOf(stopName), 1);
                        return [4 /*yield*/, this.updateStoredFavourites()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2: return [2 /*return*/, false];
                }
            });
        });
    };
    SettingsProvider.prototype.updateStoredFavourites = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.storage.set('favourites', this.favouriteStops);
                }
                catch (e) {
                    console.log('error updating stored favourites', e.message);
                }
                return [2 /*return*/];
            });
        });
    };
    SettingsProvider.prototype.getFavourites = function () {
        return this.favouriteStops;
    };
    SettingsProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Storage])
    ], SettingsProvider);
    return SettingsProvider;
}());
export { SettingsProvider };
//# sourceMappingURL=settings.js.map