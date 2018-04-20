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
import { Network } from '@ionic-native/network';
/**
 * Generated class for the NetworkWarningComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
var NetworkWarningComponent = (function () {
    function NetworkWarningComponent(network) {
        var _this = this;
        this.network = network;
        this.show = !navigator.onLine;
        console.log('Hello NetworkWarningComponent Component');
        this.sub = this.network.onConnect().subscribe(function () {
            _this.show = false;
        });
        this.sub2 = this.network.onDisconnect().subscribe(function () {
            _this.show = true;
        });
    }
    NetworkWarningComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
        this.sub2.unsubscribe();
    };
    NetworkWarningComponent = __decorate([
        Component({
            selector: 'network-warning',
            templateUrl: 'network-warning.html'
        }),
        __metadata("design:paramtypes", [Network])
    ], NetworkWarningComponent);
    return NetworkWarningComponent;
}());
export { NetworkWarningComponent };
//# sourceMappingURL=network-warning.js.map