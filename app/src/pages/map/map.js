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
import { Events, IonicPage, LoadingController, ModalController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { BusStopPage } from '../bus-stop/bus-stop';
import { BusPage } from '../bus/bus';
import { BusRouteProvider } from '../../providers/bus-route/bus-route';
import { MapOptionsPopoverPage } from '../map-options-popover/map-options-popover';
import { SettingsProvider } from '../../providers/settings/settings';
import { BusProvider } from '../../providers/bus/bus';
import { BusStopProvider } from '../../providers/bus-stop/bus-stop';
import { Geolocation } from '@ionic-native/geolocation';
var MapPage = (function () {
    function MapPage(navCtrl, navParams, modalCtrl, loadingCtrl, popoverCtrl, settings, events, busRouteProvider, busProvider, busStopProvider, geolocation) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.loadingCtrl = loadingCtrl;
        this.popoverCtrl = popoverCtrl;
        this.settings = settings;
        this.events = events;
        this.busRouteProvider = busRouteProvider;
        this.busProvider = busProvider;
        this.busStopProvider = busStopProvider;
        this.geolocation = geolocation;
        this.colors = ['#bb72e0', '#90b2ed', '#049310', '#f93616', '#ffc36b', '#f7946a', '#ef60ff'];
        this.busUrl = './assets/icon/bus.svg';
        this.busStopUrl = './assets/icon/busStop.png';
        this.loadingSpinner = this.loadingCtrl.create({
            content: 'Loading map...'
        });
        this.busIntervals = new Map();
        this.busStopMarkers = new Map();
        this.busRouteSectionLines = new Map();
        this.busMarkers = new Map();
    }
    //Unsubscribe from the server's updates when the page is closed
    MapPage.prototype.ngOnDestroy = function () {
        console.log('being destroyed!');
        this.events.unsubscribe('buses:added');
        this.events.unsubscribe('BusProvider:newBuses');
    };
    //Functions which run when the page is opened
    MapPage.prototype.ionViewDidLoad = function () {
        this.startShitUp();
    };
    MapPage.prototype.startShitUp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var latLng, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.loadingSpinner.present()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadMap()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.loadingSpinner.dismissAll()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.setupMapElements()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.getUserPosition()];
                    case 5:
                        latLng = _a.sent();
                        this.addUserPositionMarker(latLng);
                        this.map.setCenter(latLng);
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MapPage.prototype.updateMapCentre = function (_a) {
        var latitude = _a.latitude, longitude = _a.longitude;
        this.map.setCenter(new google.maps.LatLng(latitude, longitude));
    };
    MapPage.prototype.getUserPosition = function () {
        return __awaiter(this, void 0, void 0, function () {
            var geoPosition, _a, latitude, longitude, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.geolocation.getCurrentPosition()];
                    case 1:
                        geoPosition = _b.sent();
                        _a = geoPosition.coords, latitude = _a.latitude, longitude = _a.longitude;
                        return [2 /*return*/, new google.maps.LatLng(latitude, longitude)];
                    case 2:
                        e_2 = _b.sent();
                        console.log('cannot get user position :(');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MapPage.prototype.loadMap = function () {
        var _this = this;
        var latLng = new google.maps.LatLng(51.377981, -2.359026);
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
        return new Promise(function (resolve) {
            google.maps.event.addListenerOnce(_this.map, 'idle', function () {
                resolve();
            });
        });
    };
    //Adds the user's position to the map if available to the app, and sets it to update automatically
    MapPage.prototype.addUserPositionMarker = function (latLng) {
        var userPosition = new google.maps.Marker({
            map: this.map,
            position: latLng,
            title: 'Your Position',
            icon: {
                url: './assets/icon/userIcon.png',
                anchor: new google.maps.Point(16, 16),
                scaledSize: new google.maps.Size(32, 32)
            }
        });
        navigator.geolocation.watchPosition(function (position) {
            userPosition.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        });
    };
    MapPage.prototype.presentOptionsPopover = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var busRoutes, err_1, busRouteNames, popover;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.routeStates) return [3 /*break*/, 5];
                        busRoutes = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.busRouteProvider.getBusRoutes()];
                    case 2:
                        busRoutes = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log("Can't get bus routes", err_1);
                        return [2 /*return*/];
                    case 4:
                        busRouteNames = busRoutes.map(function (_a) {
                            var busRouteName = _a.busRouteName;
                            return busRouteName;
                        });
                        this.routeStates = busRouteNames.map(function (busRouteName) { return ({ busRouteName: busRouteName, active: true }); });
                        _a.label = 5;
                    case 5:
                        popover = this.popoverCtrl.create(MapOptionsPopoverPage, {
                            mapPage: this
                        });
                        return [4 /*yield*/, popover.present({
                                ev: event
                            })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MapPage.prototype.setupMapElements = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var sleep, busRoutes, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sleep = function (millis) {
                            return new Promise(function (resolve) {
                                setTimeout(function () {
                                    resolve();
                                }, millis);
                            });
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, 8, 9]);
                        return [4 /*yield*/, this.busRouteProvider.getBusRoutes()];
                    case 2:
                        busRoutes = _a.sent();
                        this.routeStates = busRoutes.map(function (_a) {
                            var busRouteName = _a.busRouteName;
                            return ({ busRouteName: busRouteName, active: true });
                        });
                        return [4 /*yield*/, this.setupMapRoutes()];
                    case 3:
                        _a.sent();
                        this.setupMapBuses();
                        return [4 /*yield*/, this.setupMapBusStops()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 5:
                        e_3 = _a.sent();
                        return [4 /*yield*/, sleep(1000)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.setupMapElements()];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        this.map.addListener('zoom_changed', function () {
                            var icons = _this.getCurrentIcons();
                            if (icons !== _this.currentIcons) {
                                _this.currentIcons = icons;
                                _this.busMarkers.forEach(function (marker) {
                                    marker.setIcon(_this.currentIcons.busIcon);
                                });
                                _this.busStopMarkers.forEach(function (marker) {
                                    marker.setIcon(_this.currentIcons.busStopIcon);
                                });
                            }
                        });
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    MapPage.prototype.getCurrentIcons = function () {
        var values = [
            {
                minValue: 15,
                busIcon: {
                    url: this.busUrl,
                    scaledSize: new google.maps.Size(64, 64),
                    anchor: new google.maps.Point(32, 50)
                },
                busStopIcon: {
                    url: this.busStopUrl,
                    scaledSize: new google.maps.Size(42, 42)
                }
            },
            {
                minValue: 12,
                busIcon: {
                    url: this.busUrl,
                    scaledSize: new google.maps.Size(48, 48),
                    anchor: new google.maps.Point(24, 34)
                },
                busStopIcon: {
                    url: this.busStopUrl,
                    scaledSize: new google.maps.Size(30, 30)
                }
            },
            {
                minValue: -Infinity,
                busIcon: {
                    url: this.busUrl,
                    scaledSize: new google.maps.Size(30, 30),
                    anchor: new google.maps.Point(15, 20)
                },
                busStopIcon: {
                    url: this.busStopUrl,
                    scaledSize: new google.maps.Size(15, 15)
                }
            }
        ];
        var busIcon, busStopIcon;
        var zoom = this.map.zoom;
        for (var i = 0; i < values.length; i++) {
            if (zoom >= values[i].minValue) {
                (_a = values[i], busIcon = _a.busIcon, busStopIcon = _a.busStopIcon);
                return { busIcon: busIcon, busStopIcon: busStopIcon };
            }
        }
        return values[0];
        var _a;
    };
    MapPage.prototype.setupMapRoutes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var sections, roundaboutCoords, roundabout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.busRouteProvider.getSections()];
                    case 1:
                        sections = _a.sent();
                        console.log('setting up map routes');
                        sections.forEach(function (section) {
                            var points = section.positions.map(function (_a) {
                                var lat = _a.latitude, lng = _a.longitude;
                                return ({ lat: lat, lng: lng });
                            });
                            var busRoute = new google.maps.Polyline({
                                path: points,
                                geodesic: true,
                                strokeColor: '#FF0000',
                                strokeOpacity: 0.2,
                                strokeWeight: 6
                            });
                            _this.busRouteSectionLines.set(section.sectionId, busRoute);
                        });
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
                        roundabout = new google.maps.Polygon({
                            paths: roundaboutCoords,
                            strokeColor: '#505050',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#505050',
                            fillOpacity: 0
                        });
                        roundabout.setMap(this.map);
                        return [4 /*yield*/, this.updateBusRoutesVisibility()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MapPage.prototype.setupMapBuses = function () {
        var _this = this;
        this.events.subscribe('BusProvider:newBuses', function (buses) {
            _this.buses = buses;
            _this.addBusesToMap();
        });
    };
    MapPage.prototype.setupMapBusStops = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, this.busStopProvider.getBusStops()];
                    case 1:
                        _a.busStops = _b.sent();
                        this.busStops.forEach(function (busStop) {
                            var busStopIcon = _this.getCurrentIcons().busStopIcon;
                            var stopMarker = new google.maps.Marker({
                                position: new google.maps.LatLng(busStop.location.latitude, busStop.location.longitude),
                                title: busStop.busStopName,
                                icon: busStopIcon
                            });
                            _this.busStopMarkers.set(busStop.busStopId, stopMarker);
                            google.maps.event.addListener(stopMarker, 'click', function () { return _this.openBusStopPage(busStop.busStopId, busStop.busStopName); });
                        });
                        this.updateBusStopsVisibility();
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _b.sent();
                        alert('error here!');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MapPage.prototype.updateMapElementsVisibility = function () {
        this.updateBusRoutesVisibility();
        this.updateBusesVisibility();
        this.updateBusStopsVisibility();
    };
    MapPage.prototype.updateBusRoutesVisibility = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var sectionsUsed_1, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getSectionsUsed()];
                    case 1:
                        sectionsUsed_1 = _a.sent();
                        this.busRouteSectionLines.forEach(function (polyline, sectionId) {
                            if (sectionsUsed_1.indexOf(sectionId) !== -1) {
                                polyline.setMap(_this.map);
                            }
                            else {
                                polyline.setMap(null);
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_5 = _a.sent();
                        console.log('how about here?');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MapPage.prototype.updateBusesVisibility = function () {
        var _this = this;
        this.buses.forEach(function (bus) {
            if (_this.busMarkers.has(bus.busId)) {
                var busMarker = _this.busMarkers.get(bus.busId);
                if (_this.getRoutesToShow().some(function (route) { return bus.routeName === route; })) {
                    if (busMarker.getMap() !== _this.map) {
                        busMarker.setMap(_this.map);
                    }
                }
                else {
                    if (busMarker.getMap() !== null) {
                        busMarker.setMap(null);
                    }
                }
            }
            else {
                console.log('we have a bus, but no marker for it?!');
            }
        });
    };
    MapPage.prototype.updateBusStopsVisibility = function () {
        var _this = this;
        var shouldShowStop = function (id) {
            return _this.busStops
                .find(function (_a) {
                var busStopId = _a.busStopId;
                return id === busStopId;
            })
                .routes
                .some(function (route) { return _this.getRoutesToShow().indexOf(route.name) !== -1; });
        };
        this.busStopMarkers.forEach(function (stopMarker, id) {
            if (shouldShowStop(id)) {
                if (stopMarker.getMap() !== _this.map)
                    stopMarker.setMap(_this.map);
            }
            else {
                if (stopMarker.getMap() !== null)
                    stopMarker.setMap(null);
            }
        });
    };
    MapPage.prototype.getRoutesToShow = function () {
        return this.routeStates
            .filter(function (_a) {
            var active = _a.active;
            return active;
        })
            .map(function (_a) {
            var busRouteName = _a.busRouteName;
            return busRouteName;
        });
    };
    MapPage.prototype.getSectionsUsed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var busRoutes, sectionsToUse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.busRouteProvider.getBusRoutes()];
                    case 1:
                        busRoutes = _a.sent();
                        sectionsToUse = new Set();
                        busRoutes.forEach(function (busRoute) {
                            if (_this.getRoutesToShow().indexOf(busRoute.busRouteName) !== -1) {
                                busRoute.sectionsUsed.forEach(function (id) { return sectionsToUse.add(id); });
                            }
                        });
                        return [2 /*return*/, Array.from(sectionsToUse)];
                }
            });
        });
    };
    MapPage.prototype.addBusesToMap = function () {
        var _this = this;
        var busIds = this.buses.map(function (_a) {
            var busId = _a.busId;
            return busId;
        });
        this.busMarkers.forEach(function (marker, id) {
            if (!busIds.some(function (i) { return i === id; })) {
                marker.setMap(null);
                _this.busMarkers.delete(id);
            }
        });
        this.buses.forEach(function (bus) { return _this.addBusToMap(bus); });
    };
    MapPage.prototype.addBusToMap = function (bus) {
        var _this = this;
        if (this.busMarkers.has(bus.busId)) {
            var busMarker = this.busMarkers.get(bus.busId);
            this.animateMovement(busMarker, bus.location);
        }
        else {
            var busIcon = this.getCurrentIcons().busIcon;
            var busMarker = new google.maps.Marker({
                position: new google.maps.LatLng(bus.location.latitude, bus.location.longitude),
                title: bus.routeName,
                icon: busIcon
            });
            this.busMarkers.set(bus.busId, busMarker);
            google.maps.event.addListener(busMarker, 'click', function () { return _this.openBusPage(bus.busId, bus.routeName); });
        }
        this.updateBusesVisibility();
    };
    MapPage.prototype.getMeAnSvg = function () {
        function addProps(e, props) {
            for (var prop in props) {
                var a = document.createAttribute(prop);
                a.value = props[prop];
                e.setAttributeNode(a);
            }
        }
        var svg = document.createElement('svg');
        var svgProps = {
            xmlns: "http://www.w3.org/2000/svg",
            version: "1.1",
            x: "0px",
            y: "0px",
            width: "512px",
            height: "512px",
            viewBox: "0 0 355.209 355.209",
            style: "enable-background:new 0 0 355.209 355.209;",
            'xml:space': "preserve"
        };
        addProps(svg, svgProps);
        var paths = [
            'M86.94,234.342c-17.69,0-32.025,14.332-32.025,32.022c0,17.691,14.335,32.021,32.025,32.021    c17.695,0,32.027-14.33,32.027-32.021C118.967,248.674,104.635,234.342,86.94,234.342z M86.94,280.288    c-7.69,0-13.921-6.231-13.921-13.922c0-7.693,6.23-13.921,13.921-13.921s13.925,6.228,13.925,13.921    C100.865,274.056,94.63,280.288,86.94,280.288z',
            'M274.949,234.342c-17.689,0-32.025,14.332-32.025,32.022c0,17.691,14.336,32.021,32.025,32.021    c17.695,0,32.027-14.33,32.027-32.021C306.977,248.674,292.645,234.342,274.949,234.342z M274.949,280.288    c-7.689,0-13.922-6.231-13.922-13.922c0-7.693,6.23-13.921,13.922-13.921s13.926,6.228,13.926,13.921    C288.875,274.056,282.639,280.288,274.949,280.288z" fill="#6b1c5d',
            'M336.068,56.823H42.101c-10.525,0-20.858,8.438-22.963,18.75L3.827,165.329C1.722,175.642,0,192.69,0,203.215    l0.957,44.014c0,10.523,8.611,19.136,19.136,19.136h29.08c0-20.823,16.941-37.763,37.766-37.763    c20.826,0,37.77,16.939,37.77,37.763h112.475c0-20.823,16.941-37.763,37.766-37.763c20.826,0,37.77,16.939,37.77,37.763h23.352    c10.525,0,19.139-8.612,19.139-19.136V75.959C355.205,65.434,346.594,56.823,336.068,56.823z M90.048,185.407H45.453l7.066-16.738    c1.233-2.921-0.134-6.289-3.055-7.522c-2.923-1.233-6.29,0.135-7.522,3.056l-8.921,21.127    c-16.668-0.736-19.058-6.767-17.708-14.035l5.092-34.401h69.644L90.048,185.407L90.048,185.407z M90.048,115.845H23.521    l4.95-33.441c1.441-7.761,9.078-14.111,16.973-14.111h44.604V115.845z M175.205,185.407H101.53v-48.512h73.675V185.407z     M175.205,115.845H101.53V68.292h73.675V115.845z M260.361,185.407h-73.676v-48.512h73.676V185.407z M260.361,115.845h-73.676    V68.292h73.676V115.845z M343.469,171.055c0,7.894-6.457,14.352-14.352,14.352h-57.275v-48.512h71.627V171.055L343.469,171.055z     M343.469,115.845h-71.627V68.292h57.275c7.895,0,14.352,6.458,14.352,14.353V115.845z" fill="#6b1c5d'
        ];
        var pathElems = paths.map(function (path) {
            var propy = {};
            propy.d = path;
            propy.fill = '#6b1c5d';
            var e = document.createElement('path');
            //console.log(props);
            addProps(e, propy);
            return e;
        });
        pathElems.forEach(function (e) {
            svg.appendChild(e);
        });
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
                        timeToAnimate = 100;
                        fps = 24;
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
        var tryModal = this.modalCtrl.create(BusPage, { busId: busId, routeName: route });
        tryModal.present();
    };
    //Opens a bus stop page with the details of the bus stop
    MapPage.prototype.openBusStopPage = function (busStopId, busStopName) {
        var tryModal = this.modalCtrl.create(BusStopPage, { stopId: busStopId, stopName: busStopName });
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
            templateUrl: 'map.html'
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ModalController,
            LoadingController,
            PopoverController,
            SettingsProvider,
            Events,
            BusRouteProvider,
            BusProvider,
            BusStopProvider,
            Geolocation])
    ], MapPage);
    return MapPage;
}());
export { MapPage };
//# sourceMappingURL=map.js.map