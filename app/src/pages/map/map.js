var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { BusStopPage } from '../bus-stop/bus-stop';
import { BusPage } from '../bus/bus';
import { ServerProvider } from '../../providers/server-provider';
var MapPage = (function () {
    /**
     * imports all the necessary parameters
     * @param {NavController} navCtrl - for navigation
     * @param {NavParams} navParams - to pass parameters around the navcontroller
     * @param {ModalController} modalctrl - to handle modals
     * @param {ServerProvider} serverService - for communicating with the server
     */
    function MapPage(navCtrl, navParams, modalctrl, serverService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalctrl = modalctrl;
        this.serverService = serverService;
        //colors for the bus routes
        this.colors = ['#bb72e0', '#90b2ed', '#049310', '#f93616', '#ffc36b', '#f7946a', '#ef60ff'];
        this.busStopMarkers = new Map();
        this.busRouteLines = new Map();
        this.busMarkers = new Map();
    }
    MapPage.prototype.ngOnDestroy = function () {
        this.busSubscription.unsubscribe();
        this.stopsSubscription.unsubscribe();
    };
    MapPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.loadMap()
            .then(function (latLng) {
            if (latLng != null)
                _this.addUserPositionMarker(latLng);
            _this.addBusStops();
            _this.addBusRoutes();
            _this.addBuses();
        });
    };
    /*
     * Gets the user's position and calls createmap with it. If user's position request is denied creates map with bath spa station as the center
     * @return - a promise saying that the map was created successfully
     */
    MapPage.prototype.loadMap = function () {
        var _this = this;
        var geo = navigator.geolocation;
        return new Promise(function (resolve) {
            geo.getCurrentPosition(function (position) {
                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                _this.createMap(latLng);
                resolve(latLng);
            }, function () {
                var latLng = new google.maps.LatLng(51.377981, -2.359026);
                _this.createMap(latLng);
                console.log('Permission denied');
                resolve(null);
            });
        });
    };
    MapPage.prototype.createMap = function (latLng) {
        var mapOptions = {
            center: latLng,
            zoom: 15,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [{
                    featureType: 'transit.station.bus',
                    elementType: 'all',
                    stylers: [{
                            visibility: 'off'
                        }]
                }]
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    };
    MapPage.prototype.addUserPositionMarker = function (latLng) {
        var userPosition = new google.maps.Marker({
            map: this.map,
            position: latLng,
            title: 'Your Position',
            icon: {
                scale: 5,
                path: google.maps.SymbolPath.CIRCLE
            }
        });
        navigator.geolocation.watchPosition(function (position) {
            userPosition.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        });
    };
    MapPage.prototype.addBusStops = function () {
        var _this = this;
        var busStops = [];
        this.serverService.getBusStopLocations().then(function (data) {
            busStops = data;
            busStops = busStops.data;
            for (var i = 0; i < busStops.length; i++) {
                _this.addBusStop(busStops[i]);
            }
        });
    };
    MapPage.prototype.addBusStop = function (busStop) {
        var _this = this;
        var stopMarker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(busStop.location.latitude, busStop.location.longitude),
            title: busStop.busStopName,
            icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 3
            }
        });
        this.busStopMarkers.set(busStop.busStopId, stopMarker);
        google.maps.event.addListener(stopMarker, 'click', function () { return _this.openBusStopPage(busStop.busStopId, busStop.busStopName); });
    };
    MapPage.prototype.openBusStopPage = function (busStopId, busStopName) {
        var tryModal = this.modalctrl.create(BusStopPage, { stopID: busStopId, stopName: busStopName });
        tryModal.present();
    };
    MapPage.prototype.addBusRoutes = function () {
        var exampleBusRouteCoordinates = [
            {
                "sectionId": 0,
                "sectionDescription": "Start: Uni; End: ClavertonDownRd",
                "positions": [
                    { "latitude": 51.379117, "longitude": -2.325228 },
                    { "latitude": 51.379043, "longitude": -2.325035 },
                    { "latitude": 51.378772, "longitude": -2.325094 },
                    { "latitude": 51.378454, "longitude": -2.325164 },
                    { "latitude": 51.378062, "longitude": -2.325255 },
                    { "latitude": 51.377841, "longitude": -2.325304 },
                    { "latitude": 51.377697, "longitude": -2.325395 },
                    { "latitude": 51.377537, "longitude": -2.325545 },
                    { "latitude": 51.377473, "longitude": -2.325615 },
                    { "latitude": 51.377349, "longitude": -2.325706 },
                    { "latitude": 51.377208, "longitude": -2.325674 },
                    { "latitude": 51.377091, "longitude": -2.325599 },
                    { "latitude": 51.377004, "longitude": -2.325497 },
                    { "latitude": 51.376937, "longitude": -2.325363 },
                    { "latitude": 51.376820, "longitude": -2.325105 },
                    { "latitude": 51.376753, "longitude": -2.324890 },
                    { "latitude": 51.376659, "longitude": -2.324681 },
                    { "latitude": 51.376539, "longitude": -2.324499 },
                    { "latitude": 51.376391, "longitude": -2.324408 },
                    { "latitude": 51.376291, "longitude": -2.324402 },
                    { "latitude": 51.376174, "longitude": -2.324424 },
                    { "latitude": 51.376043, "longitude": -2.324520 },
                    { "latitude": 51.375836, "longitude": -2.324671 },
                    { "latitude": 51.375407, "longitude": -2.325019 },
                    { "latitude": 51.374865, "longitude": -2.325518 },
                    { "latitude": 51.374325, "longitude": -2.326006 },
                    { "latitude": 51.374034, "longitude": -2.326210 },
                    { "latitude": 51.373713, "longitude": -2.326500 }
                ]
            },
            {
                "sectionId": 1,
                "sectionDescription": "Start: ClavertonDownRd; End: BottomofBathwickHill",
                "positions": [
                    { "latitude": 51.373706, "longitude": -2.326505 },
                    { "latitude": 51.374516, "longitude": -2.329241 },
                    { "latitude": 51.374553, "longitude": -2.329375 },
                    { "latitude": 51.375414, "longitude": -2.330341 },
                    { "latitude": 51.375809, "longitude": -2.330781 },
                    { "latitude": 51.376154, "longitude": -2.331151 },
                    { "latitude": 51.376408, "longitude": -2.331371 },
                    { "latitude": 51.376576, "longitude": -2.331521 },
                    { "latitude": 51.376756, "longitude": -2.331859 },
                    { "latitude": 51.376897, "longitude": -2.332143 },
                    { "latitude": 51.377041, "longitude": -2.332653 },
                    { "latitude": 51.377225, "longitude": -2.333211 },
                    { "latitude": 51.377520, "longitude": -2.334219 },
                    { "latitude": 51.377600, "longitude": -2.334788 },
                    { "latitude": 51.377661, "longitude": -2.335496 },
                    { "latitude": 51.377721, "longitude": -2.336665 },
                    { "latitude": 51.377808, "longitude": -2.337728 },
                    { "latitude": 51.377888, "longitude": -2.338436 },
                    { "latitude": 51.377928, "longitude": -2.338661 },
                    { "latitude": 51.377969, "longitude": -2.338897 },
                    { "latitude": 51.378092, "longitude": -2.339208 },
                    { "latitude": 51.378290, "longitude": -2.339616 },
                    { "latitude": 51.378558, "longitude": -2.340024 },
                    { "latitude": 51.378886, "longitude": -2.340678 },
                    { "latitude": 51.379281, "longitude": -2.341413 },
                    { "latitude": 51.379412, "longitude": -2.341611 },
                    { "latitude": 51.379499, "longitude": -2.341794 },
                    { "latitude": 51.379529, "longitude": -2.341955 },
                    { "latitude": 51.379670, "longitude": -2.342432 },
                    { "latitude": 51.379807, "longitude": -2.343044 },
                    { "latitude": 51.379964, "longitude": -2.343671 },
                    { "latitude": 51.380152, "longitude": -2.344186 },
                    { "latitude": 51.380466, "longitude": -2.344927 },
                    { "latitude": 51.380694, "longitude": -2.345356 },
                    { "latitude": 51.381056, "longitude": -2.345721 },
                    { "latitude": 51.381504, "longitude": -2.346150 },
                    { "latitude": 51.381889, "longitude": -2.346606 },
                    { "latitude": 51.382197, "longitude": -2.347062 },
                    { "latitude": 51.382351, "longitude": -2.347351 },
                    { "latitude": 51.382489, "longitude": -2.347727 },
                    { "latitude": 51.382633, "longitude": -2.348199 },
                    { "latitude": 51.382730, "longitude": -2.348537 },
                    { "latitude": 51.382753, "longitude": -2.348687 },
                    { "latitude": 51.382770, "longitude": -2.348848 },
                    { "latitude": 51.382787, "longitude": -2.349089 },
                    { "latitude": 51.382827, "longitude": -2.349266 },
                    { "latitude": 51.382900, "longitude": -2.349497 },
                    { "latitude": 51.382971, "longitude": -2.349642 },
                    { "latitude": 51.383135, "longitude": -2.349905 },
                    { "latitude": 51.383366, "longitude": -2.350227 },
                    { "latitude": 51.383573, "longitude": -2.350543 },
                    { "latitude": 51.383764, "longitude": -2.350838 },
                    { "latitude": 51.383908, "longitude": -2.351085 },
                    { "latitude": 51.384069, "longitude": -2.351401 }
                ]
            },
            {
                "sectionId": 2,
                "sectionDescription": "Start: BottomofBathwickHill; End: NorthParade",
                "positions": [
                    { "latitude": 51.384062, "longitude": -2.351423 },
                    { "latitude": 51.383721, "longitude": -2.351401 },
                    { "latitude": 51.383152, "longitude": -2.351391 },
                    { "latitude": 51.382171, "longitude": -2.351348 },
                    { "latitude": 51.381414, "longitude": -2.351316 },
                    { "latitude": 51.380918, "longitude": -2.351283 }
                ]
            },
            {
                "sectionId": 3,
                "sectionDescription": "Start: NorthParade; End:NorthParade",
                "positions": [
                    { "latitude": 51.380918, "longitude": -2.351283 },
                    { "latitude": 51.380902, "longitude": -2.352265 },
                    { "latitude": 51.380868, "longitude": -2.353488 },
                    { "latitude": 51.380845, "longitude": -2.355022 },
                    { "latitude": 51.380811, "longitude": -2.356653 },
                    { "latitude": 51.380821, "longitude": -2.357195 }
                ]
            },
            {
                "sectionId": 4,
                "sectionDescription": "Start: NorthParade; End: BusStation",
                "positions": [
                    { "latitude": 51.380821, "longitude": -2.357195 },
                    { "latitude": 51.380510, "longitude": -2.357157 },
                    { "latitude": 51.379967, "longitude": -2.357115 },
                    { "latitude": 51.379291, "longitude": -2.357082 },
                    { "latitude": 51.378618, "longitude": -2.357056 },
                    { "latitude": 51.377938, "longitude": -2.357013 },
                    { "latitude": 51.377912, "longitude": -2.357453 },
                    { "latitude": 51.377982, "longitude": -2.358595 },
                    { "latitude": 51.378025, "longitude": -2.359421 },
                    { "latitude": 51.378056, "longitude": -2.359759 }
                ]
            },
            {
                "sectionId": 5,
                "sectionDescription": "Start: BusStation; End: Roundabout",
                "positions": [
                    { "latitude": 51.378056, "longitude": -2.359759 },
                    { "latitude": 51.378056, "longitude": -2.359759 },
                    { "latitude": 51.377866, "longitude": -2.359826 },
                    { "latitude": 51.377866, "longitude": -2.359826 },
                    { "latitude": 51.377839, "longitude": -2.359969 },
                    { "latitude": 51.377855, "longitude": -2.360267 },
                    { "latitude": 51.377789, "longitude": -2.360385 },
                    { "latitude": 51.377738, "longitude": -2.360418 },
                    { "latitude": 51.377534, "longitude": -2.360472 },
                    { "latitude": 51.377484, "longitude": -2.360473 },
                    { "latitude": 51.377456, "longitude": -2.360465 },
                    { "latitude": 51.377421, "longitude": -2.360426 },
                    { "latitude": 51.377390, "longitude": -2.360370 }
                ]
            },
            {
                "sectionId": 6,
                "sectionDescription": "Start: Roundabout; End: LowerOldfieldPark",
                "positions": [
                    { "latitude": 51.377454, "longitude": -2.361383 },
                    { "latitude": 51.377567, "longitude": -2.361760 },
                    { "latitude": 51.377661, "longitude": -2.362109 },
                    { "latitude": 51.377975, "longitude": -2.363369 },
                    { "latitude": 51.378293, "longitude": -2.364646 },
                    { "latitude": 51.378451, "longitude": -2.365478 },
                    { "latitude": 51.378538, "longitude": -2.366180 },
                    { "latitude": 51.378581, "longitude": -2.366540 },
                    { "latitude": 51.378605, "longitude": -2.367007 },
                    { "latitude": 51.378652, "longitude": -2.367484 },
                    { "latitude": 51.378702, "longitude": -2.367768 },
                    { "latitude": 51.378772, "longitude": -2.368037 },
                    { "latitude": 51.378903, "longitude": -2.368455 }
                ]
            },
            {
                "sectionId": 7,
                "sectionDescription": "Start: LowerOldfieldPark; End: BroughamHayes",
                "positions": [
                    { "latitude": 51.378903, "longitude": -2.368455 },
                    { "latitude": 51.378739, "longitude": -2.368600 },
                    { "latitude": 51.378575, "longitude": -2.368653 },
                    { "latitude": 51.378390, "longitude": -2.368664 },
                    { "latitude": 51.378163, "longitude": -2.368675 },
                    { "latitude": 51.378046, "longitude": -2.368729 },
                    { "latitude": 51.377935, "longitude": -2.368782 },
                    { "latitude": 51.377784, "longitude": -2.368948 },
                    { "latitude": 51.377540, "longitude": -2.369308 },
                    { "latitude": 51.377366, "longitude": -2.369571 },
                    { "latitude": 51.377289, "longitude": -2.369699 },
                    { "latitude": 51.377235, "longitude": -2.369812 },
                    { "latitude": 51.377208, "longitude": -2.369978 },
                    { "latitude": 51.377192, "longitude": -2.370247 },
                    { "latitude": 51.377192, "longitude": -2.370933 },
                    { "latitude": 51.377185, "longitude": -2.371218 },
                    { "latitude": 51.377162, "longitude": -2.371438 },
                    { "latitude": 51.377121, "longitude": -2.371733 },
                    { "latitude": 51.377085, "longitude": -2.371899 },
                    { "latitude": 51.377075, "longitude": -2.372017 },
                    { "latitude": 51.377078, "longitude": -2.372167 },
                    { "latitude": 51.377101, "longitude": -2.372296 },
                    { "latitude": 51.377142, "longitude": -2.372409 },
                    { "latitude": 51.377202, "longitude": -2.372521 },
                    { "latitude": 51.377329, "longitude": -2.372671 },
                    { "latitude": 51.377493, "longitude": -2.372838 },
                    { "latitude": 51.377584, "longitude": -2.373015 },
                    { "latitude": 51.377600, "longitude": -2.373208 },
                    { "latitude": 51.377594, "longitude": -2.373379 },
                    { "latitude": 51.377570, "longitude": -2.373519 },
                    { "latitude": 51.377617, "longitude": -2.373712 },
                    { "latitude": 51.377751, "longitude": -2.374157 },
                    { "latitude": 51.377858, "longitude": -2.374549 },
                    { "latitude": 51.378009, "longitude": -2.375064 },
                    { "latitude": 51.378139, "longitude": -2.375557 },
                    { "latitude": 51.378180, "longitude": -2.375718 },
                    { "latitude": 51.378196, "longitude": -2.375879 },
                    { "latitude": 51.378206, "longitude": -2.376035 },
                    { "latitude": 51.378233, "longitude": -2.376185 },
                    { "latitude": 51.378263, "longitude": -2.376298 },
                    { "latitude": 51.378323, "longitude": -2.376426 },
                    { "latitude": 51.378397, "longitude": -2.376534 }
                ]
            },
            {
                "sectionId": 8,
                "sectionDescription": "Start: BroughamHayes; End: PinesWay",
                "positions": [
                    { "latitude": 51.378397, "longitude": -2.376534 },
                    { "latitude": 51.378501, "longitude": -2.376603 },
                    { "latitude": 51.378642, "longitude": -2.376630 },
                    { "latitude": 51.378735, "longitude": -2.376587 },
                    { "latitude": 51.378853, "longitude": -2.376566 },
                    { "latitude": 51.378956, "longitude": -2.376523 },
                    { "latitude": 51.379013, "longitude": -2.376448 },
                    { "latitude": 51.379074, "longitude": -2.376357 },
                    { "latitude": 51.379137, "longitude": -2.376233 },
                    { "latitude": 51.379214, "longitude": -2.376105 },
                    { "latitude": 51.379291, "longitude": -2.375981 },
                    { "latitude": 51.379971, "longitude": -2.375359 },
                    { "latitude": 51.380982, "longitude": -2.374409 },
                    { "latitude": 51.381166, "longitude": -2.374211 },
                    { "latitude": 51.381116, "longitude": -2.374034 },
                    { "latitude": 51.380982, "longitude": -2.373707 },
                    { "latitude": 51.380912, "longitude": -2.373524 },
                    { "latitude": 51.380882, "longitude": -2.373444 },
                    { "latitude": 51.380872, "longitude": -2.373331 },
                    { "latitude": 51.380865, "longitude": -2.373213 },
                    { "latitude": 51.380885, "longitude": -2.373111 },
                    { "latitude": 51.380908, "longitude": -2.373031 },
                    { "latitude": 51.380952, "longitude": -2.372966 },
                    { "latitude": 51.381072, "longitude": -2.372859 },
                    { "latitude": 51.381119, "longitude": -2.372779 },
                    { "latitude": 51.381143, "longitude": -2.372698 },
                    { "latitude": 51.381169, "longitude": -2.372602 },
                    { "latitude": 51.381176, "longitude": -2.372516 },
                    { "latitude": 51.381166, "longitude": -2.372403 },
                    { "latitude": 51.381133, "longitude": -2.372296 },
                    { "latitude": 51.381092, "longitude": -2.372194 },
                    { "latitude": 51.380965, "longitude": -2.371883 },
                    { "latitude": 51.380761, "longitude": -2.371384 },
                    { "latitude": 51.380550, "longitude": -2.370858 }
                ]
            },
            {
                "sectionId": 9,
                "sectionDescription": "Start: PinesWay; End: BusStation",
                "positions": [
                    { "latitude": 51.380550, "longitude": -2.370858 },
                    { "latitude": 51.380497, "longitude": -2.370713 },
                    { "latitude": 51.380440, "longitude": -2.370526 },
                    { "latitude": 51.380396, "longitude": -2.370424 },
                    { "latitude": 51.380379, "longitude": -2.370322 },
                    { "latitude": 51.380366, "longitude": -2.370220 },
                    { "latitude": 51.380369, "longitude": -2.370139 },
                    { "latitude": 51.380396, "longitude": -2.369995 },
                    { "latitude": 51.380420, "longitude": -2.369887 },
                    { "latitude": 51.380453, "longitude": -2.369694 },
                    { "latitude": 51.380493, "longitude": -2.369463 },
                    { "latitude": 51.380563, "longitude": -2.369093 },
                    { "latitude": 51.380630, "longitude": -2.368820 },
                    { "latitude": 51.380851, "longitude": -2.368267 },
                    { "latitude": 51.381116, "longitude": -2.367672 },
                    { "latitude": 51.381210, "longitude": -2.367430 },
                    { "latitude": 51.381250, "longitude": -2.367302 },
                    { "latitude": 51.381260, "longitude": -2.367232 },
                    { "latitude": 51.381260, "longitude": -2.367151 },
                    { "latitude": 51.381253, "longitude": -2.367087 },
                    { "latitude": 51.381246, "longitude": -2.367001 },
                    { "latitude": 51.381240, "longitude": -2.366937 },
                    { "latitude": 51.381226, "longitude": -2.366846 },
                    { "latitude": 51.381213, "longitude": -2.366749 },
                    { "latitude": 51.381156, "longitude": -2.366465 },
                    { "latitude": 51.381106, "longitude": -2.366239 },
                    { "latitude": 51.380808, "longitude": -2.366320 },
                    { "latitude": 51.380644, "longitude": -2.366352 },
                    { "latitude": 51.380430, "longitude": -2.366368 },
                    { "latitude": 51.380306, "longitude": -2.366347 },
                    { "latitude": 51.380162, "longitude": -2.366309 },
                    { "latitude": 51.380055, "longitude": -2.366234 },
                    { "latitude": 51.379911, "longitude": -2.366121 },
                    { "latitude": 51.379753, "longitude": -2.365918 },
                    { "latitude": 51.379609, "longitude": -2.365655 },
                    { "latitude": 51.379512, "longitude": -2.365456 },
                    { "latitude": 51.379418, "longitude": -2.365204 },
                    { "latitude": 51.379241, "longitude": -2.364775 },
                    { "latitude": 51.379187, "longitude": -2.364351 },
                    { "latitude": 51.379207, "longitude": -2.363884 },
                    { "latitude": 51.379211, "longitude": -2.363412 },
                    { "latitude": 51.379167, "longitude": -2.362726 },
                    { "latitude": 51.379151, "longitude": -2.362382 },
                    { "latitude": 51.379050, "longitude": -2.361905 },
                    { "latitude": 51.378953, "longitude": -2.361411 },
                    { "latitude": 51.378899, "longitude": -2.361170 },
                    { "latitude": 51.378873, "longitude": -2.360891 },
                    { "latitude": 51.378846, "longitude": -2.360618 },
                    { "latitude": 51.378826, "longitude": -2.360473 },
                    { "latitude": 51.378802, "longitude": -2.360365 },
                    { "latitude": 51.378772, "longitude": -2.360296 },
                    { "latitude": 51.378742, "longitude": -2.360237 },
                    { "latitude": 51.378652, "longitude": -2.360113 },
                    { "latitude": 51.378555, "longitude": -2.359979 },
                    { "latitude": 51.378461, "longitude": -2.359872 },
                    { "latitude": 51.378347, "longitude": -2.359781 },
                    { "latitude": 51.378210, "longitude": -2.359732 },
                    { "latitude": 51.378056, "longitude": -2.359759 }
                ]
            },
            {
                "sectionId": 10,
                "sectionDescription": "Start: PinesWay; End: LowerOldfieldPark",
                "positions": [
                    { "latitude": 51.380550, "longitude": -2.370858 },
                    { "latitude": 51.380473, "longitude": -2.370746 },
                    { "latitude": 51.380399, "longitude": -2.370590 },
                    { "latitude": 51.380336, "longitude": -2.370515 },
                    { "latitude": 51.380292, "longitude": -2.370461 },
                    { "latitude": 51.380242, "longitude": -2.370472 },
                    { "latitude": 51.380168, "longitude": -2.370493 },
                    { "latitude": 51.380081, "longitude": -2.370585 },
                    { "latitude": 51.380024, "longitude": -2.370670 },
                    { "latitude": 51.379967, "longitude": -2.370724 },
                    { "latitude": 51.379914, "longitude": -2.370762 },
                    { "latitude": 51.379847, "longitude": -2.370772 },
                    { "latitude": 51.379777, "longitude": -2.370762 },
                    { "latitude": 51.379710, "longitude": -2.370708 },
                    { "latitude": 51.379663, "longitude": -2.370649 },
                    { "latitude": 51.379515, "longitude": -2.370236 },
                    { "latitude": 51.379341, "longitude": -2.369726 },
                    { "latitude": 51.379120, "longitude": -2.369066 },
                    { "latitude": 51.378903, "longitude": -2.368455 }
                ]
            },
            {
                "sectionId": 11,
                "sectionDescription": "Start: NorthParade; End: NorthParade",
                "positions": [
                    { "latitude": 51.380821, "longitude": -2.357195 },
                    { "latitude": 51.381461, "longitude": -2.357533 }
                ]
            },
            {
                "sectionId": 12,
                "sectionDescription": "Start: BathAbbey; End: PultneyBridge",
                "positions": [
                    { "latitude": 51.381461, "longitude": -2.357533 },
                    { "latitude": 51.381498, "longitude": -2.357624 },
                    { "latitude": 51.381518, "longitude": -2.357715 },
                    { "latitude": 51.381521, "longitude": -2.357785 },
                    { "latitude": 51.381521, "longitude": -2.357855 },
                    { "latitude": 51.381521, "longitude": -2.357925 },
                    { "latitude": 51.381518, "longitude": -2.357984 },
                    { "latitude": 51.381514, "longitude": -2.358064 },
                    { "latitude": 51.381534, "longitude": -2.358134 },
                    { "latitude": 51.381595, "longitude": -2.358198 },
                    { "latitude": 51.381648, "longitude": -2.358268 },
                    { "latitude": 51.381695, "longitude": -2.358370 },
                    { "latitude": 51.381735, "longitude": -2.358568 },
                    { "latitude": 51.381745, "longitude": -2.358745 },
                    { "latitude": 51.381786, "longitude": -2.358896 },
                    { "latitude": 51.381832, "longitude": -2.359008 },
                    { "latitude": 51.381943, "longitude": -2.359046 },
                    { "latitude": 51.382268, "longitude": -2.359121 },
                    { "latitude": 51.382485, "longitude": -2.359148 },
                    { "latitude": 51.382619, "longitude": -2.359148 },
                    { "latitude": 51.382700, "longitude": -2.359083 },
                    { "latitude": 51.382753, "longitude": -2.358965 },
                    { "latitude": 51.382790, "longitude": -2.358815 },
                    { "latitude": 51.382823, "longitude": -2.358681 },
                    { "latitude": 51.382860, "longitude": -2.358536 }
                ]
            },
            {
                "sectionId": 13,
                "sectionDescription": "Start: PultneyBridge; End: BathAbbey",
                "positions": [
                    { "latitude": 51.382860, "longitude": -2.358536 },
                    { "latitude": 51.382857, "longitude": -2.358461 },
                    { "latitude": 51.382854, "longitude": -2.358381 },
                    { "latitude": 51.382847, "longitude": -2.358311 },
                    { "latitude": 51.382837, "longitude": -2.358252 },
                    { "latitude": 51.382797, "longitude": -2.358182 },
                    { "latitude": 51.382743, "longitude": -2.358112 },
                    { "latitude": 51.382479, "longitude": -2.357769 },
                    { "latitude": 51.382227, "longitude": -2.357431 },
                    { "latitude": 51.382137, "longitude": -2.357345 },
                    { "latitude": 51.382040, "longitude": -2.357351 },
                    { "latitude": 51.381960, "longitude": -2.357426 },
                    { "latitude": 51.381916, "longitude": -2.357522 },
                    { "latitude": 51.381832, "longitude": -2.357630 },
                    { "latitude": 51.381709, "longitude": -2.357640 },
                    { "latitude": 51.381571, "longitude": -2.357581 },
                    { "latitude": 51.381461, "longitude": -2.357533 }
                ]
            },
            {
                "sectionId": 14,
                "sectionDescription": "Start: PultneyBridge; End: BottomOfBathwickHill",
                "positions": [
                    { "latitude": 51.382860, "longitude": -2.358536 },
                    { "latitude": 51.383078, "longitude": -2.357790 },
                    { "latitude": 51.383322, "longitude": -2.357147 },
                    { "latitude": 51.383373, "longitude": -2.357013 },
                    { "latitude": 51.383439, "longitude": -2.356857 },
                    { "latitude": 51.383543, "longitude": -2.356664 },
                    { "latitude": 51.383620, "longitude": -2.356508 },
                    { "latitude": 51.383711, "longitude": -2.356380 },
                    { "latitude": 51.383727, "longitude": -2.356246 },
                    { "latitude": 51.383771, "longitude": -2.356085 },
                    { "latitude": 51.383888, "longitude": -2.355757 },
                    { "latitude": 51.384045, "longitude": -2.355253 },
                    { "latitude": 51.384363, "longitude": -2.354438 },
                    { "latitude": 51.384712, "longitude": -2.353558 },
                    { "latitude": 51.385010, "longitude": -2.352780 },
                    { "latitude": 51.385231, "longitude": -2.352228 },
                    { "latitude": 51.385361, "longitude": -2.351997 },
                    { "latitude": 51.385519, "longitude": -2.351809 },
                    { "latitude": 51.385468, "longitude": -2.351707 },
                    { "latitude": 51.385358, "longitude": -2.351578 },
                    { "latitude": 51.385060, "longitude": -2.351482 },
                    { "latitude": 51.384732, "longitude": -2.351471 },
                    { "latitude": 51.384474, "longitude": -2.351439 },
                    { "latitude": 51.384072, "longitude": -2.351428 }
                ]
            },
            {
                "sectionId": 15,
                "sectionDescription": "Start: ClavertonDownRd; End: BroughamHayes",
                "positions": [
                    { "latitude": 51.3736778, "longitude": -2.3265013 },
                    { "latitude": 51.3730013, "longitude": -2.3241953 },
                    { "latitude": 51.372526, "longitude": -2.3225998 },
                    { "latitude": 51.3721453, "longitude": -2.3212911 },
                    { "latitude": 51.3719329, "longitude": -2.3206153 },
                    { "latitude": 51.371667, "longitude": -2.3198131 },
                    { "latitude": 51.371415, "longitude": -2.319161 },
                    { "latitude": 51.371198, "longitude": -2.318748 },
                    { "latitude": 51.371005, "longitude": -2.3184689 },
                    { "latitude": 51.3708161, "longitude": -2.3182651 },
                    { "latitude": 51.3706887, "longitude": -2.3181444 },
                    { "latitude": 51.3705227, "longitude": -2.318019 },
                    { "latitude": 51.3703081, "longitude": -2.3179168 },
                    { "latitude": 51.3700017, "longitude": -2.3178258 },
                    { "latitude": 51.3696854, "longitude": -2.3177369 },
                    { "latitude": 51.3693473, "longitude": -2.3176537 },
                    { "latitude": 51.368962, "longitude": -2.3176356 },
                    { "latitude": 51.3686807, "longitude": -2.317649 },
                    { "latitude": 51.368395, "longitude": -2.3176805 },
                    { "latitude": 51.3681957, "longitude": -2.317775 },
                    { "latitude": 51.367936, "longitude": -2.3179167 },
                    { "latitude": 51.3677293, "longitude": -2.3180625 },
                    { "latitude": 51.3674994, "longitude": -2.3182235 },
                    { "latitude": 51.3672155, "longitude": -2.3184515 },
                    { "latitude": 51.366852, "longitude": -2.3187438 },
                    { "latitude": 51.36654, "longitude": -2.3190215 },
                    { "latitude": 51.3663876, "longitude": -2.319142 },
                    { "latitude": 51.3662864, "longitude": -2.3193327 },
                    { "latitude": 51.3660812, "longitude": -2.3196604 },
                    { "latitude": 51.3659079, "longitude": -2.3199905 },
                    { "latitude": 51.3657234, "longitude": -2.3204001 },
                    { "latitude": 51.3656085, "longitude": -2.3207921 },
                    { "latitude": 51.365477, "longitude": -2.321527 },
                    { "latitude": 51.36533, "longitude": -2.322273 },
                    { "latitude": 51.365159, "longitude": -2.323107 },
                    { "latitude": 51.3650256, "longitude": -2.3237247 },
                    { "latitude": 51.3647611, "longitude": -2.3250356 },
                    { "latitude": 51.3645122, "longitude": -2.326256 },
                    { "latitude": 51.3643261, "longitude": -2.327304 },
                    { "latitude": 51.3641629, "longitude": -2.3283583 },
                    { "latitude": 51.3639878, "longitude": -2.3296276 },
                    { "latitude": 51.36386, "longitude": -2.330609 },
                    { "latitude": 51.363732, "longitude": -2.331655 },
                    { "latitude": 51.3636072, "longitude": -2.3327424 },
                    { "latitude": 51.3635169, "longitude": -2.3335917 },
                    { "latitude": 51.363436, "longitude": -2.3344407 },
                    { "latitude": 51.363362, "longitude": -2.33515 },
                    { "latitude": 51.3632962, "longitude": -2.3358557 },
                    { "latitude": 51.3632047, "longitude": -2.3367338 },
                    { "latitude": 51.3631116, "longitude": -2.3376847 },
                    { "latitude": 51.3630011, "longitude": -2.3387575 },
                    { "latitude": 51.3628887, "longitude": -2.3398103 },
                    { "latitude": 51.3627938, "longitude": -2.340722 },
                    { "latitude": 51.362687, "longitude": -2.341606 },
                    { "latitude": 51.362584, "longitude": -2.342373 },
                    { "latitude": 51.362533, "longitude": -2.343344 },
                    { "latitude": 51.3625244, "longitude": -2.3441383 },
                    { "latitude": 51.3625237, "longitude": -2.3447037 },
                    { "latitude": 51.3625, "longitude": -2.344986 },
                    { "latitude": 51.362463, "longitude": -2.345152 },
                    { "latitude": 51.3622678, "longitude": -2.3457472 },
                    { "latitude": 51.36184, "longitude": -2.347003 },
                    { "latitude": 51.360678, "longitude": -2.350457 },
                    { "latitude": 51.3602574, "longitude": -2.3518739 },
                    { "latitude": 51.3600322, "longitude": -2.353228 },
                    { "latitude": 51.3599858, "longitude": -2.3535521 },
                    { "latitude": 51.3599289, "longitude": -2.3536626 },
                    { "latitude": 51.3599346, "longitude": -2.3538302 },
                    { "latitude": 51.3598745, "longitude": -2.3541107 },
                    { "latitude": 51.3595789, "longitude": -2.3555872 },
                    { "latitude": 51.3592771, "longitude": -2.35696 },
                    { "latitude": 51.3591253, "longitude": -2.357966 },
                    { "latitude": 51.3589985, "longitude": -2.358973 },
                    { "latitude": 51.3588125, "longitude": -2.3603374 },
                    { "latitude": 51.358534, "longitude": -2.362179 },
                    { "latitude": 51.358172, "longitude": -2.364099 },
                    { "latitude": 51.3579629, "longitude": -2.365066 },
                    { "latitude": 51.3577184, "longitude": -2.3660127 },
                    { "latitude": 51.3573974, "longitude": -2.3669596 },
                    { "latitude": 51.357003, "longitude": -2.367945 },
                    { "latitude": 51.3569102, "longitude": -2.3680592 },
                    { "latitude": 51.3569365, "longitude": -2.3683018 },
                    { "latitude": 51.356753, "longitude": -2.3686536 },
                    { "latitude": 51.3565746, "longitude": -2.3691942 },
                    { "latitude": 51.3565186, "longitude": -2.3694867 },
                    { "latitude": 51.3565152, "longitude": -2.3698293 },
                    { "latitude": 51.3565245, "longitude": -2.3700804 },
                    { "latitude": 51.356588, "longitude": -2.370426 },
                    { "latitude": 51.3567072, "longitude": -2.3707821 },
                    { "latitude": 51.3569457, "longitude": -2.3714711 },
                    { "latitude": 51.3571095, "longitude": -2.3719701 },
                    { "latitude": 51.3571792, "longitude": -2.3722546 },
                    { "latitude": 51.3572077, "longitude": -2.3724394 },
                    { "latitude": 51.3571467, "longitude": -2.372493 },
                    { "latitude": 51.3571304, "longitude": -2.3726014 },
                    { "latitude": 51.3571618, "longitude": -2.3727037 },
                    { "latitude": 51.3572255, "longitude": -2.372726 },
                    { "latitude": 51.3572779, "longitude": -2.3726954 },
                    { "latitude": 51.357398, "longitude": -2.373025 },
                    { "latitude": 51.3575283, "longitude": -2.3733726 },
                    { "latitude": 51.3578835, "longitude": -2.3742966 },
                    { "latitude": 51.3582907, "longitude": -2.3753806 },
                    { "latitude": 51.3584814, "longitude": -2.3756793 },
                    { "latitude": 51.3584536, "longitude": -2.3757587 },
                    { "latitude": 51.3584653, "longitude": -2.3758395 },
                    { "latitude": 51.3585026, "longitude": -2.3759034 },
                    { "latitude": 51.3585552, "longitude": -2.3759192 },
                    { "latitude": 51.3586014, "longitude": -2.3758835 },
                    { "latitude": 51.3586643, "longitude": -2.3760205 },
                    { "latitude": 51.3588952, "longitude": -2.3765053 },
                    { "latitude": 51.359156, "longitude": -2.3770729 },
                    { "latitude": 51.359525, "longitude": -2.3778873 },
                    { "latitude": 51.3600316, "longitude": -2.378981 },
                    { "latitude": 51.3604605, "longitude": -2.3799667 },
                    { "latitude": 51.3610064, "longitude": -2.3812343 },
                    { "latitude": 51.3612568, "longitude": -2.3819213 },
                    { "latitude": 51.3616935, "longitude": -2.383446 },
                    { "latitude": 51.3618674, "longitude": -2.384005 },
                    { "latitude": 51.3618906, "longitude": -2.3841944 },
                    { "latitude": 51.3618956, "longitude": -2.3843092 },
                    { "latitude": 51.3618825, "longitude": -2.3843917 },
                    { "latitude": 51.3618454, "longitude": -2.3844199 },
                    { "latitude": 51.3618171, "longitude": -2.384485 },
                    { "latitude": 51.3618119, "longitude": -2.3845751 },
                    { "latitude": 51.3618341, "longitude": -2.3846585 },
                    { "latitude": 51.3618733, "longitude": -2.3846958 },
                    { "latitude": 51.3619319, "longitude": -2.384709 },
                    { "latitude": 51.3620793, "longitude": -2.3848579 },
                    { "latitude": 51.3622196, "longitude": -2.3850957 },
                    { "latitude": 51.3625386, "longitude": -2.3859827 },
                    { "latitude": 51.362829, "longitude": -2.3868041 },
                    { "latitude": 51.3630723, "longitude": -2.387351 },
                    { "latitude": 51.3632878, "longitude": -2.3876647 },
                    { "latitude": 51.3635625, "longitude": -2.388034 },
                    { "latitude": 51.3637891, "longitude": -2.3883734 },
                    { "latitude": 51.3639541, "longitude": -2.3887415 },
                    { "latitude": 51.364064, "longitude": -2.3891498 },
                    { "latitude": 51.3641098, "longitude": -2.3895704 },
                    { "latitude": 51.3641468, "longitude": -2.3901115 },
                    { "latitude": 51.364195, "longitude": -2.390739 },
                    { "latitude": 51.364302, "longitude": -2.391307 },
                    { "latitude": 51.3644513, "longitude": -2.3918937 },
                    { "latitude": 51.364642, "longitude": -2.3922985 },
                    { "latitude": 51.3651401, "longitude": -2.3931904 },
                    { "latitude": 51.36565, "longitude": -2.394095 },
                    { "latitude": 51.3658212, "longitude": -2.3937236 },
                    { "latitude": 51.36605, "longitude": -2.39304 },
                    { "latitude": 51.3663413, "longitude": -2.392226 },
                    { "latitude": 51.3666593, "longitude": -2.3913633 },
                    { "latitude": 51.3668424, "longitude": -2.3909502 },
                    { "latitude": 51.3671474, "longitude": -2.3903555 },
                    { "latitude": 51.3672494, "longitude": -2.39006 },
                    { "latitude": 51.3673063, "longitude": -2.3897942 },
                    { "latitude": 51.3673463, "longitude": -2.3892853 },
                    { "latitude": 51.3673682, "longitude": -2.3888803 },
                    { "latitude": 51.3673977, "longitude": -2.3886493 },
                    { "latitude": 51.3674586, "longitude": -2.3884402 },
                    { "latitude": 51.3675587, "longitude": -2.3882845 },
                    { "latitude": 51.367686, "longitude": -2.3881258 },
                    { "latitude": 51.3677952, "longitude": -2.3879802 },
                    { "latitude": 51.3679139, "longitude": -2.3877588 },
                    { "latitude": 51.3679946, "longitude": -2.3874232 },
                    { "latitude": 51.3680853, "longitude": -2.3874556 },
                    { "latitude": 51.3682306, "longitude": -2.3874047 },
                    { "latitude": 51.3686965, "longitude": -2.3871396 },
                    { "latitude": 51.369088, "longitude": -2.386903 },
                    { "latitude": 51.3697348, "longitude": -2.3865197 },
                    { "latitude": 51.3705165, "longitude": -2.3860425 },
                    { "latitude": 51.3709275, "longitude": -2.3857324 },
                    { "latitude": 51.371643, "longitude": -2.3851641 },
                    { "latitude": 51.3723227, "longitude": -2.3846382 },
                    { "latitude": 51.3727597, "longitude": -2.3842581 },
                    { "latitude": 51.3730419, "longitude": -2.3838807 },
                    { "latitude": 51.3733173, "longitude": -2.3835066 },
                    { "latitude": 51.3735936, "longitude": -2.3831639 },
                    { "latitude": 51.3738737, "longitude": -2.3829605 },
                    { "latitude": 51.3740957, "longitude": -2.3828326 },
                    { "latitude": 51.3746062, "longitude": -2.3828006 },
                    { "latitude": 51.375233, "longitude": -2.382789 },
                    { "latitude": 51.375574, "longitude": -2.382778 },
                    { "latitude": 51.3756782, "longitude": -2.3827455 },
                    { "latitude": 51.3759097, "longitude": -2.3825416 },
                    { "latitude": 51.3762185, "longitude": -2.3822668 },
                    { "latitude": 51.376033, "longitude": -2.3817886 },
                    { "latitude": 51.3757923, "longitude": -2.3811272 },
                    { "latitude": 51.3755836, "longitude": -2.3805325 },
                    { "latitude": 51.377219, "longitude": -2.378873 },
                    { "latitude": 51.377289, "longitude": -2.378798 },
                    { "latitude": 51.3778299, "longitude": -2.378138 },
                    { "latitude": 51.3778763, "longitude": -2.3780667 },
                    { "latitude": 51.3778975, "longitude": -2.3779903 },
                    { "latitude": 51.3779025, "longitude": -2.3778906 },
                    { "latitude": 51.3778975, "longitude": -2.3777717 },
                    { "latitude": 51.3778853, "longitude": -2.37766 },
                    { "latitude": 51.377882, "longitude": -2.377558 },
                    { "latitude": 51.3778913, "longitude": -2.3774757 },
                    { "latitude": 51.3779439, "longitude": -2.3773742 },
                    { "latitude": 51.3780848, "longitude": -2.3772348 },
                    { "latitude": 51.3782796, "longitude": -2.3770363 },
                    { "latitude": 51.378354, "longitude": -2.3769567 },
                    { "latitude": 51.3783753, "longitude": -2.3768157 },
                    { "latitude": 51.3783881, "longitude": -2.3766853 },
                    { "latitude": 51.378387, "longitude": -2.3765809 }
                ]
            },
            {
                "sectionId": 16,
                "sectionDescription": "Start: Roundabout; End: NorthParade",
                "positions": [
                    { "latitude": 51.377153, "longitude": -2.359604 },
                    { "latitude": 51.377039, "longitude": -2.359281 },
                    { "latitude": 51.377033, "longitude": -2.358528 },
                    { "latitude": 51.376992, "longitude": -2.358096 },
                    { "latitude": 51.376829, "longitude": -2.357339 },
                    { "latitude": 51.376772, "longitude": -2.356934 },
                    { "latitude": 51.376750, "longitude": -2.356624 },
                    { "latitude": 51.376767, "longitude": -2.356288 },
                    { "latitude": 51.376960, "longitude": -2.355058 },
                    { "latitude": 51.376976, "longitude": -2.354080 },
                    { "latitude": 51.377288, "longitude": -2.352721 },
                    { "latitude": 51.377524, "longitude": -2.352059 },
                    { "latitude": 51.378356, "longitude": -2.351228 },
                    { "latitude": 51.378600, "longitude": -2.351076 },
                    { "latitude": 51.378940, "longitude": -2.351089 },
                    { "latitude": 51.379553, "longitude": -2.351225 },
                    { "latitude": 51.380940, "longitude": -2.351292 }
                ]
            }
        ]; //oiafhsaoidhjsadnaosi
        var roundaboutCoords = [
            { lat: 51.377484, lng: -2.361208 },
            { lat: 51.377484, lng: -2.361208 },
            { lat: 51.377314, lng: -2.359773 },
            { lat: 51.377296, lng: -2.359740 },
            { lat: 51.377169, lng: -2.359606 },
            { lat: 51.377153, lng: -2.359604 },
            { lat: 51.377118, lng: -2.359625 },
            { lat: 51.377085, lng: -2.359652 },
            { lat: 51.377043, lng: -2.359702 },
            { lat: 51.377004, lng: -2.359801 },
            { lat: 51.377161, lng: -2.361322 },
            { lat: 51.377194, lng: -2.361415 },
            { lat: 51.377233, lng: -2.361461 },
            { lat: 51.377278, lng: -2.361488 },
            { lat: 51.377328, lng: -2.361506 },
            { lat: 51.377371, lng: -2.361495 },
            { lat: 51.377413, lng: -2.361458 },
            { lat: 51.377434, lng: -2.361423 },
            { lat: 51.377454, lng: -2.361383 },
            { lat: 51.377480, lng: -2.361299 },
            { lat: 51.377483, lng: -2.361218 },
            { lat: 51.377484, lng: -2.361208 }
        ];
        for (var i = 0; i < exampleBusRouteCoordinates.length; i++) {
            var busRoutePath = exampleBusRouteCoordinates[i].positions;
            var googleMapStyle = busRoutePath.map(function (_a) {
                var latitude = _a.latitude, longitude = _a.longitude;
                return { lat: latitude, lng: longitude };
            });
            var busRoute = new google.maps.Polyline({
                path: googleMapStyle,
                geodesic: true,
                strokeColor: this.colors[i % 7],
                strokeOpacity: 0.8,
                strokeWeight: 3
            });
            this.busRouteLines.set(exampleBusRouteCoordinates[i].sectionId, busRoute);
            busRoute.setMap(this.map);
        }
        var roundabout = new google.maps.Polygon({
            paths: roundaboutCoords,
            strokeColor: '#505050',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#505050',
            fillOpacity: 1
        });
        roundabout.setMap(this.map);
    };
    MapPage.prototype.addBuses = function () {
        var _this = this;
        setInterval(function () {
            _this.serverService.getBusLocations().then(function (buses) {
                for (var i = 0; i < buses.length; i++) {
                    _this.addBus(buses[i]);
                }
            });
        }, 1000);
    };
    MapPage.prototype.addBus = function (bus) {
        var _this = this;
        if (this.busMarkers.get(bus.busId)) {
            this.busMarkers.get(bus.busId).setPosition(new google.maps.LatLng(bus.location.latitude, bus.location.longitude));
        }
        else {
            var busMarker = new google.maps.Marker({
                map: this.map,
                position: new google.maps.LatLng(bus.location.latitude, bus.location.longitude),
                title: bus.routeName
            });
            this.busMarkers.set(bus.busId, busMarker);
            google.maps.event.addListener(busMarker, 'click', function () { return _this.openBusPage(bus.busId, bus.routeName); });
        }
    };
    MapPage.prototype.openBusPage = function (busId, route) {
        var tryModal = this.modalctrl.create(BusPage, { busId: busId, routeName: route });
        tryModal.present();
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], MapPage.prototype, "mapElement", void 0);
    MapPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-map',
            templateUrl: 'map.html',
            providers: [ServerProvider]
        }),
        __metadata("design:paramtypes", [NavController, NavParams, ModalController, ServerProvider])
    ], MapPage);
    return MapPage;
}());
export { MapPage };
//# sourceMappingURL=map.js.map