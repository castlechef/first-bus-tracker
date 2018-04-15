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
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { BusStopPage } from '../bus-stop/bus-stop';
import { BusPage } from '../bus/bus';
import { ServerProvider } from '../../providers/server-provider';
import { BusRouteProvider } from '../../providers/bus-route/bus-route';
var MapPage = (function () {
    /**
     * imports all the necessary parameters
     * @param {NavController} navCtrl - for navigation
     * @param {NavParams} navParams - to pass parameters around the navcontroller
     * @param {ModalController} modalctrl - to handle modals
     * @param {ServerProvider} serverService - for communicating with the server
     */
    function MapPage(navCtrl, navParams, modalctrl, serverService, busRouteProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalctrl = modalctrl;
        this.serverService = serverService;
        this.busRouteProvider = busRouteProvider;
        //colors for the bus routes
        this.colors = ['#bb72e0', '#90b2ed', '#049310', '#f93616', '#ffc36b', '#f7946a', '#ef60ff'];
        this.busStopMarkers = new Map();
        this.busRouteLines = new Map();
        this.busMarkers = new Map();
    }
    //Unsubscribe from the server's updates when the page is closed
    MapPage.prototype.ngOnDestroy = function () {
        this.busSubscription.unsubscribe();
        this.stopsSubscription.unsubscribe();
    };
    //Functions which run when the page is opened
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
    //Creates the initial map centered around latLng
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
    //Adds the user's position to the map if available to the app, and sets it to update automatically
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
    //gets the bus stops from the server and adds them to the map - they are set to update automatically.
    MapPage.prototype.addBusStops = function () {
        var _this = this;
        var busStops = [];
        this.serverService.getBusStopLocations().then(function (data) {
            busStops = data;
            busStops = busStops.data;
            for (var i = 0; i < busStops.length; i++) {
                _this.addBusStop(busStops[i]);
            }
        }, function (rejected) {
            console.log(rejected);
            _this.addBusStops();
        });
    };
    //adds a single bus stop to the map with a click event that opens the relevant busstoppage
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
    //Opens a bus stop page with the details of the bus stop
    MapPage.prototype.openBusStopPage = function (busStopId, busStopName) {
        var tryModal = this.modalctrl.create(BusStopPage, { stopId: busStopId, stopName: busStopName });
        tryModal.present();
    };
    //Adds the bus routes from the default routes (Future: Communicate with server to obtain the routes)
    MapPage.prototype.addBusRoutes = function (routesToShow) {
        if (routesToShow === void 0) { routesToShow = ["U1"]; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            function getSectionFromId(id) {
                return sections.find(function (s) { return s.sectionId === id; });
            }
            function getAllUsedSections() {
                var allSections = [];
                routes
                    .filter(function (_a) {
                    var busRouteName = _a.busRouteName;
                    return routesToShow.indexOf(busRouteName) !== -1;
                })
                    .forEach(function (_a) {
                    var sectionsUsed = _a.sectionsUsed;
                    return sectionsUsed.forEach(function (s) { return allSections.push(s); });
                });
                // Convert to a set then back to an array to remove duplicates
                return Array.from(new Set(allSections));
            }
            var roundaboutCoords, routes, sections, e_1, roundabout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roundaboutCoords = [
                            { lat: 51.377484, lng: -2.361208 },
                            { lat: 51.377484, lng: -2.361208 },
                            { lat: 51.377385, lng: -2.360370 },
                            { lat: 51.377337, lng: -2.359838 },
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
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.busRouteProvider.getBusRoutes()];
                    case 2:
                        routes = _a.sent();
                        return [4 /*yield*/, this.busRouteProvider.getSections()];
                    case 3:
                        sections = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.log('Cannot get routes data.');
                        return [2 /*return*/];
                    case 5:
                        //routes.forEach(({busRouteName, sectionsUsed}) => {
                        //  sectionsUsed.forEach(sectionId => {
                        getAllUsedSections().forEach(function (sectionId) {
                            var section = getSectionFromId(sectionId);
                            var googleMapStyle = section.positions.map(function (_a) {
                                var lat = _a.latitude, lng = _a.longitude;
                                return ({ lat: lat, lng: lng });
                            });
                            var busRoute = new google.maps.Polyline({
                                path: googleMapStyle,
                                geodesic: true,
                                strokeColor: '#FF0000',
                                strokeOpacity: 0.2,
                                strokeWeight: 6,
                                map: _this.map
                            });
                            _this.busRouteLines.set('', busRoute);
                        });
                        roundabout = new google.maps.Polygon({
                            paths: roundaboutCoords,
                            strokeColor: '#505050',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#505050',
                            fillOpacity: 0
                        });
                        roundabout.setMap(this.map);
                        return [2 /*return*/];
                }
            });
        });
    };
    //Gets the buses from the server, adds the to the map - set to update automatically
    MapPage.prototype.addBuses = function () {
        var _this = this;
        setInterval(function () {
            _this.serverService.getBusLocations().then(function (buses) {
                for (var i = 0; i < buses.length; i++) {
                    _this.addBus(buses[i]);
                }
            }, function (rejected) {
                console.log(rejected);
            });
        }, 1000);
    };
    //Adds a bus marker to the map with a click event
    MapPage.prototype.addBus = function (bus) {
        var _this = this;
        if (this.busMarkers.get(bus.busId)) {
            var marker = this.busMarkers.get(bus.busId);
            this.animateMovement(marker, bus.location);
            //this.busMarkers.get(bus.busId).setPosition(new google.maps.LatLng(bus.location.latitude, bus.location.longitude));
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
    //Animates the movement of a marker to a new longitude/latitude
    MapPage.prototype.animateMovement = function (marker, location) {
        return __awaiter(this, void 0, void 0, function () {
            function sleep(millis) {
                return new Promise(function (resolve) {
                    setTimeout(function () { return resolve(); }, millis);
                });
            }
            function ease(x) {
                return ((Math.sin((x - 0.5) * Math.PI)) + 1) / 2;
            }
            var timeToAnimate, fps, totalFrames, oldLat, newLat, oldLon, newLon, latDif, lonDif, i, proportion, lat, lng;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeToAnimate = 90;
                        fps = 60;
                        totalFrames = timeToAnimate * fps / 1000;
                        oldLat = marker.getPosition().lat();
                        newLat = location.latitude;
                        oldLon = marker.getPosition().lng();
                        newLon = location.longitude;
                        latDif = newLat - oldLat;
                        lonDif = newLon - oldLon;
                        i = 1;
                        _a.label = 1;
                    case 1:
                        if (!(i <= totalFrames)) return [3 /*break*/, 4];
                        proportion = ease(i / totalFrames);
                        lat = oldLat + (proportion * latDif);
                        lng = oldLon + (proportion * lonDif);
                        return [4 /*yield*/, sleep(1000 / fps)];
                    case 2:
                        _a.sent();
                        marker.setPosition({ lat: lat, lng: lng });
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //Opens the bus page with the bus info of the bus given.
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
        __metadata("design:paramtypes", [NavController, NavParams, ModalController, ServerProvider, BusRouteProvider])
    ], MapPage);
    return MapPage;
}());
export { MapPage };
//# sourceMappingURL=map.js.map