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
import { ServerProvider } from '../../providers/server-provider';
import { NavController } from 'ionic-angular';
var Page2 = (function () {
    function Page2(navCtrl, serverService) {
        this.navCtrl = navCtrl;
        this.serverService = serverService;
        this.buses = [];
        //this.loadBuses();
    }
    Page2.prototype.ngOnInit = function () {
        var _this = this;
        this.serverService.getLocations()
            .subscribe(function (data) {
            _this.buses = data;
            console.log(_this.buses.status);
            _this.buses = _this.buses.data;
            console.log(_this.buses);
        }, function (error) { return _this.errorMessage = error; });
    };
    Page2 = __decorate([
        Component({
            selector: 'page-page2',
            templateUrl: 'page2.html',
            providers: [ServerProvider]
        }),
        __metadata("design:paramtypes", [NavController, ServerProvider])
    ], Page2);
    return Page2;
}());
export { Page2 };
//# sourceMappingURL=page2.js.map