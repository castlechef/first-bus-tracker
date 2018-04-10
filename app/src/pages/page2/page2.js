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
    /**
     * imports all the necessary parameters
     * @param {NavController} navCtrl - for navigation
     * @param {ServerProvider} serverService - for getting buses
     * @param {StopsProvider} stopsService - for getting bus stops
     */
    function Page2(navCtrl, serverService) {
        this.navCtrl = navCtrl;
        this.serverService = serverService;
        this.buses = [];
        this.stops = [];
        //this.loadBuses();
    }
    Page2.prototype.ngOnInit = function () {
        /**
         * subscribes to the data for the buses coming from its provider
         * @type {Subscription}
         */
        /*this.busSubcription = this.serverService.getBusLocations()
          .subscribe(data => {
            this.buses = data;
            console.log(this.buses.status);
            this.buses = this.buses.data;
            console.log(this.buses);
          },
          error => this.errorMessage = error);*/
        /**
         * subscribes to the data for the bus stops coming from its provider
         * @type {Subscription}
         */
        /*this.stopsSubcription = this.serverService.getBusStopLocations()
          .subscribe(data=> {
            this.stops = data;
            console.log(this.stops.status);
            this.stops  = this.stops.data;
            console.log(this.stops);
          },
            error => this.stopsErrorMsg = error);*/
    };
    /**
     * when the page is closed so to is the subscriptions to the providers
     * if this isn't done these won't be cleared from memory
     */
    Page2.prototype.ngOnDestroy = function () {
        this.busSubcription.unsubscribe();
        this.stopsSubcription.unsubscribe();
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