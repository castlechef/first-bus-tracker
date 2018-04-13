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
        var tryModal = this.modalctrl.create(BusStopPage, { stopID: busStopId, stopName: busStopName });
        tryModal.present();
    };
    //Adds the bus routes from the default routes (Future: Communicate with server to obtain the routes)
    MapPage.prototype.addBusRoutes = function () {
        var _this = this;
        var exampleBusRouteCoordinates = [
            {
                "sectionId": 0,
                "sectionDescription": "Start: Uni; End: ClavertonDownRd",
                "positions": [
                    { "latitude": 51.378738, "longitude": -2.325070 },
                    { "latitude": 51.379056, "longitude": -2.324975 },
                    { "latitude": 51.379078, "longitude": -2.325328 },
                    { "latitude": 51.379078, "longitude": -2.325361 },
                    { "latitude": 51.379071, "longitude": -2.325415 },
                    { "latitude": 51.379061, "longitude": -2.325442 },
                    { "latitude": 51.379049, "longitude": -2.325457 },
                    { "latitude": 51.379036, "longitude": -2.325466 },
                    { "latitude": 51.379018, "longitude": -2.325471 },
                    { "latitude": 51.378992, "longitude": -2.325468 },
                    { "latitude": 51.378958, "longitude": -2.325449 },
                    { "latitude": 51.378875, "longitude": -2.325334 },
                    { "latitude": 51.378738, "longitude": -2.325070 },
                    { "latitude": 51.378358, "longitude": -2.325164 },
                    { "latitude": 51.377846, "longitude": -2.325288 },
                    { "latitude": 51.377776, "longitude": -2.325318 },
                    { "latitude": 51.377729, "longitude": -2.325346 },
                    { "latitude": 51.377679, "longitude": -2.325385 },
                    { "latitude": 51.377600, "longitude": -2.325475 },
                    { "latitude": 51.377530, "longitude": -2.325574 },
                    { "latitude": 51.377470, "longitude": -2.325638 },
                    { "latitude": 51.377393, "longitude": -2.325681 },
                    { "latitude": 51.377339, "longitude": -2.325698 },
                    { "latitude": 51.377286, "longitude": -2.325701 },
                    { "latitude": 51.377233, "longitude": -2.325691 },
                    { "latitude": 51.377184, "longitude": -2.325678 },
                    { "latitude": 51.377142, "longitude": -2.325655 },
                    { "latitude": 51.377107, "longitude": -2.325624 },
                    { "latitude": 51.377069, "longitude": -2.325581 },
                    { "latitude": 51.377030, "longitude": -2.325524 },
                    { "latitude": 51.376937, "longitude": -2.325336 },
                    { "latitude": 51.376805, "longitude": -2.325002 },
                    { "latitude": 51.376713, "longitude": -2.324744 },
                    { "latitude": 51.376663, "longitude": -2.324646 },
                    { "latitude": 51.376620, "longitude": -2.324579 },
                    { "latitude": 51.376532, "longitude": -2.324488 },
                    { "latitude": 51.376448, "longitude": -2.324436 },
                    { "latitude": 51.376396, "longitude": -2.324421 },
                    { "latitude": 51.376325, "longitude": -2.324415 },
                    { "latitude": 51.376162, "longitude": -2.324457 },
                    { "latitude": 51.375903, "longitude": -2.324610 },
                    { "latitude": 51.375663, "longitude": -2.324765 },
                    { "latitude": 51.375303, "longitude": -2.325056 },
                    { "latitude": 51.374220, "longitude": -2.326046 },
                    { "latitude": 51.3736778, "longitude": -2.3265013 }
                ]
            },
            {
                "sectionId": 1,
                "sectionDescription": "Start: ClavertonDownRd; End: BottomofBathwickHill",
                "positions": [
                    { "latitude": 51.3736778, "longitude": -2.3265013 },
                    { "latitude": 51.374546, "longitude": -2.329342 },
                    { "latitude": 51.376526, "longitude": -2.331456 },
                    { "latitude": 51.376698, "longitude": -2.331705 },
                    { "latitude": 51.376803, "longitude": -2.331941 },
                    { "latitude": 51.376887, "longitude": -2.332147 },
                    { "latitude": 51.376984, "longitude": -2.332402 },
                    { "latitude": 51.377212, "longitude": -2.333175 },
                    { "latitude": 51.377442, "longitude": -2.334020 },
                    { "latitude": 51.377546, "longitude": -2.334447 },
                    { "latitude": 51.377621, "longitude": -2.334896 },
                    { "latitude": 51.377750, "longitude": -2.337002 },
                    { "latitude": 51.377786, "longitude": -2.337504 },
                    { "latitude": 51.377855, "longitude": -2.338142 },
                    { "latitude": 51.377931, "longitude": -2.338674 },
                    { "latitude": 51.377994, "longitude": -2.338922 },
                    { "latitude": 51.378146, "longitude": -2.339305 },
                    { "latitude": 51.378573, "longitude": -2.340046 },
                    { "latitude": 51.379393, "longitude": -2.341560 },
                    { "latitude": 51.379583, "longitude": -2.342026 },
                    { "latitude": 51.379721, "longitude": -2.342577 },
                    { "latitude": 51.379840, "longitude": -2.343213 },
                    { "latitude": 51.379935, "longitude": -2.343602 },
                    { "latitude": 51.380244, "longitude": -2.344455 },
                    { "latitude": 51.380401, "longitude": -2.344807 },
                    { "latitude": 51.380584, "longitude": -2.345160 },
                    { "latitude": 51.380746, "longitude": -2.345395 },
                    { "latitude": 51.380858, "longitude": -2.345511 },
                    { "latitude": 51.381154, "longitude": -2.345771 },
                    { "latitude": 51.381452, "longitude": -2.346060 },
                    { "latitude": 51.381714, "longitude": -2.346365 },
                    { "latitude": 51.382076, "longitude": -2.346858 },
                    { "latitude": 51.382277, "longitude": -2.347185 },
                    { "latitude": 51.382341, "longitude": -2.347312 },
                    { "latitude": 51.382409, "longitude": -2.347488 },
                    { "latitude": 51.382600, "longitude": -2.348111 },
                    { "latitude": 51.382717, "longitude": -2.348552 },
                    { "latitude": 51.382773, "longitude": -2.348846 },
                    { "latitude": 51.382797, "longitude": -2.349149 },
                    { "latitude": 51.382822, "longitude": -2.349266 },
                    { "latitude": 51.382947, "longitude": -2.349605 },
                    { "latitude": 51.383053, "longitude": -2.349794 },
                    { "latitude": 51.384072, "longitude": -2.351252 },
                ]
            },
            {
                "sectionId": 2,
                "sectionDescription": "Start: BottomofBathwickHill; End: NorthParade",
                "positions": [
                    { "latitude": 51.384072, "longitude": -2.351252 },
                    { "latitude": 51.384051, "longitude": -2.351258 },
                    { "latitude": 51.384024, "longitude": -2.351278 },
                    { "latitude": 51.384002, "longitude": -2.351315 },
                    { "latitude": 51.383984, "longitude": -2.351377 },
                    { "latitude": 51.383982, "longitude": -2.351402 },
                    { "latitude": 51.383763, "longitude": -2.351403 },
                    { "latitude": 51.380930, "longitude": -2.351281 }
                ]
            },
            {
                "sectionId": 3,
                "sectionDescription": "Start: NorthParade; End:NorthParade",
                "positions": [
                    { "latitude": 51.380930, "longitude": -2.351281 },
                    { "latitude": 51.380821, "longitude": -2.357195 }
                ]
            },
            {
                "sectionId": 4,
                "sectionDescription": "Start: NorthParade; End: BusStation",
                "positions": [
                    { "latitude": 51.380821, "longitude": -2.357195 },
                    { "latitude": 51.380669, "longitude": -2.357148 },
                    { "latitude": 51.379945, "longitude": -2.357091 },
                    { "latitude": 51.377937, "longitude": -2.356994 },
                    { "latitude": 51.377893, "longitude": -2.358112 },
                    { "latitude": 51.377896, "longitude": -2.358449 },
                    { "latitude": 51.378003, "longitude": -2.359743 }
                ]
            },
            {
                "sectionId": 5,
                "sectionDescription": "Start: BusStation; End: Roundabout",
                "positions": [
                    { "latitude": 51.378003, "longitude": -2.359743 },
                    { "latitude": 51.377959, "longitude": -2.359757 },
                    { "latitude": 51.377925, "longitude": -2.359772 },
                    { "latitude": 51.377901, "longitude": -2.359789 },
                    { "latitude": 51.377868, "longitude": -2.359832 },
                    { "latitude": 51.377849, "longitude": -2.359870 },
                    { "latitude": 51.377835, "longitude": -2.359972 },
                    { "latitude": 51.377854, "longitude": -2.360269 },
                    { "latitude": 51.377818, "longitude": -2.360338 },
                    { "latitude": 51.377800, "longitude": -2.360370 },
                    { "latitude": 51.377785, "longitude": -2.360385 },
                    { "latitude": 51.377736, "longitude": -2.360421 },
                    { "latitude": 51.377693, "longitude": -2.360437 },
                    { "latitude": 51.377643, "longitude": -2.360444 },
                    { "latitude": 51.377524, "longitude": -2.360474 },
                    { "latitude": 51.377487, "longitude": -2.360475 },
                    { "latitude": 51.377457, "longitude": -2.360462 },
                    { "latitude": 51.377423, "longitude": -2.360426 },
                    { "latitude": 51.377399, "longitude": -2.360380 },
                    { "latitude": 51.377385, "longitude": -2.360370 }
                ]
            },
            {
                "sectionId": 6,
                "sectionDescription": "Start: Roundabout; End: LowerOldfieldPark",
                "positions": [
                    { "latitude": 51.377443, "longitude": -2.361406 },
                    { "latitude": 51.377503, "longitude": -2.361494 },
                    { "latitude": 51.377681, "longitude": -2.362219 },
                    { "latitude": 51.377831, "longitude": -2.362798 },
                    { "latitude": 51.378333, "longitude": -2.364746 },
                    { "latitude": 51.378399, "longitude": -2.365151 },
                    { "latitude": 51.378417, "longitude": -2.365301 },
                    { "latitude": 51.378571, "longitude": -2.366471 },
                    { "latitude": 51.378610, "longitude": -2.367000 },
                    { "latitude": 51.378647, "longitude": -2.367417 },
                    { "latitude": 51.378673, "longitude": -2.367610 },
                    { "latitude": 51.378747, "longitude": -2.367959 },
                    { "latitude": 51.378911, "longitude": -2.368459 }
                ]
            },
            {
                "sectionId": 7,
                "sectionDescription": "Start: LowerOldfieldPark; End: BroughamHayes",
                "positions": [
                    { "latitude": 51.378911, "longitude": -2.368459 },
                    { "latitude": 51.378685, "longitude": -2.368604 },
                    { "latitude": 51.378638, "longitude": -2.368617 },
                    { "latitude": 51.378638, "longitude": -2.368617 },
                    { "latitude": 51.378122, "longitude": -2.368669 },
                    { "latitude": 51.378042, "longitude": -2.368691 },
                    { "latitude": 51.377935, "longitude": -2.368745 },
                    { "latitude": 51.377881, "longitude": -2.368790 },
                    { "latitude": 51.377775, "longitude": -2.368915 },
                    { "latitude": 51.377322, "longitude": -2.369604 },
                    { "latitude": 51.377265, "longitude": -2.369715 },
                    { "latitude": 51.377238, "longitude": -2.369798 },
                    { "latitude": 51.377214, "longitude": -2.369899 },
                    { "latitude": 51.377199, "longitude": -2.369987 },
                    { "latitude": 51.377190, "longitude": -2.370092 },
                    { "latitude": 51.377183, "longitude": -2.370283 },
                    { "latitude": 51.377192, "longitude": -2.370728 },
                    { "latitude": 51.377191, "longitude": -2.371128 },
                    { "latitude": 51.377147, "longitude": -2.371577 },
                    { "latitude": 51.377077, "longitude": -2.371962 },
                    { "latitude": 51.377072, "longitude": -2.372053 },
                    { "latitude": 51.377078, "longitude": -2.372155 },
                    { "latitude": 51.377088, "longitude": -2.372225 },
                    { "latitude": 51.377139, "longitude": -2.372375 },
                    { "latitude": 51.377191, "longitude": -2.372476 },
                    { "latitude": 51.377235, "longitude": -2.372519 },
                    { "latitude": 51.377508, "longitude": -2.372804 },
                    { "latitude": 51.377550, "longitude": -2.372865 },
                    { "latitude": 51.377606, "longitude": -2.373039 },
                    { "latitude": 51.377606, "longitude": -2.373039 },
                    { "latitude": 51.377605, "longitude": -2.373253 },
                    { "latitude": 51.377572, "longitude": -2.373486 },
                    { "latitude": 51.377617, "longitude": -2.373696 },
                    { "latitude": 51.378074, "longitude": -2.375322 },
                    { "latitude": 51.378193, "longitude": -2.375889 },
                    { "latitude": 51.378237, "longitude": -2.376108 },
                    { "latitude": 51.378285, "longitude": -2.376316 },
                    { "latitude": 51.378349, "longitude": -2.376492 },
                    { "latitude": 51.378392, "longitude": -2.376585 }
                ]
            },
            {
                "sectionId": 8,
                "sectionDescription": "Start: BroughamHayes; End: PinesWay",
                "positions": [
                    { "latitude": 51.378392, "longitude": -2.376585 },
                    { "latitude": 51.378494, "longitude": -2.376627 },
                    { "latitude": 51.378596, "longitude": -2.376631 },
                    { "latitude": 51.378675, "longitude": -2.376624 },
                    { "latitude": 51.378720, "longitude": -2.376631 },
                    { "latitude": 51.378903, "longitude": -2.376590 },
                    { "latitude": 51.378955, "longitude": -2.376564 },
                    { "latitude": 51.378998, "longitude": -2.376534 },
                    { "latitude": 51.379032, "longitude": -2.376490 },
                    { "latitude": 51.379065, "longitude": -2.376424 },
                    { "latitude": 51.379118, "longitude": -2.376276 },
                    { "latitude": 51.379174, "longitude": -2.376158 },
                    { "latitude": 51.379247, "longitude": -2.376053 },
                    { "latitude": 51.379468, "longitude": -2.375784 },
                    { "latitude": 51.380336, "longitude": -2.375024 },
                    { "latitude": 51.380991, "longitude": -2.374395 },
                    { "latitude": 51.381165, "longitude": -2.374249 },
                    { "latitude": 51.381065, "longitude": -2.373940 },
                    { "latitude": 51.380928, "longitude": -2.373638 },
                    { "latitude": 51.380841, "longitude": -2.373429 },
                    { "latitude": 51.380842, "longitude": -2.373290 },
                    { "latitude": 51.380844, "longitude": -2.373217 },
                    { "latitude": 51.380892, "longitude": -2.373009 },
                    { "latitude": 51.380972, "longitude": -2.372939 },
                    { "latitude": 51.381088, "longitude": -2.372806 },
                    { "latitude": 51.381135, "longitude": -2.372722 },
                    { "latitude": 51.381157, "longitude": -2.372543 },
                    { "latitude": 51.381163, "longitude": -2.372470 },
                    { "latitude": 51.381157, "longitude": -2.372422 },
                    { "latitude": 51.381133, "longitude": -2.372325 },
                    { "latitude": 51.380800, "longitude": -2.371476 },
                    { "latitude": 51.380437, "longitude": -2.370557 }
                ]
            },
            {
                "sectionId": 9,
                "sectionDescription": "Start: PinesWay; End: BusStation",
                "positions": [
                    { "latitude": 51.380437, "longitude": -2.370557 },
                    { "latitude": 51.380390, "longitude": -2.370342 },
                    { "latitude": 51.380376, "longitude": -2.370265 },
                    { "latitude": 51.380374, "longitude": -2.370107 },
                    { "latitude": 51.380383, "longitude": -2.370012 },
                    { "latitude": 51.380423, "longitude": -2.369897 },
                    { "latitude": 51.380445, "longitude": -2.369799 },
                    { "latitude": 51.380528, "longitude": -2.369357 },
                    { "latitude": 51.380544, "longitude": -2.369288 },
                    { "latitude": 51.380592, "longitude": -2.369041 },
                    { "latitude": 51.380651, "longitude": -2.368821 },
                    { "latitude": 51.380746, "longitude": -2.368547 },
                    { "latitude": 51.381158, "longitude": -2.367565 },
                    { "latitude": 51.381226, "longitude": -2.367401 },
                    { "latitude": 51.381247, "longitude": -2.367327 },
                    { "latitude": 51.381257, "longitude": -2.367211 },
                    { "latitude": 51.381260, "longitude": -2.367117 },
                    { "latitude": 51.381259, "longitude": -2.367051 },
                    { "latitude": 51.381251, "longitude": -2.366975 },
                    { "latitude": 51.381208, "longitude": -2.366796 },
                    { "latitude": 51.381134, "longitude": -2.366548 },
                    { "latitude": 51.381096, "longitude": -2.366397 },
                    { "latitude": 51.381065, "longitude": -2.366229 },
                    { "latitude": 51.380946, "longitude": -2.366273 },
                    { "latitude": 51.380542, "longitude": -2.366353 },
                    { "latitude": 51.380338, "longitude": -2.366333 },
                    { "latitude": 51.380132, "longitude": -2.366267 },
                    { "latitude": 51.379903, "longitude": -2.366093 },
                    { "latitude": 51.379787, "longitude": -2.365946 },
                    { "latitude": 51.379679, "longitude": -2.365787 },
                    { "latitude": 51.379526, "longitude": -2.365447 },
                    { "latitude": 51.379331, "longitude": -2.364933 },
                    { "latitude": 51.379225, "longitude": -2.364695 },
                    { "latitude": 51.379201, "longitude": -2.363779 },
                    { "latitude": 51.379202, "longitude": -2.363345 },
                    { "latitude": 51.379194, "longitude": -2.363251 },
                    { "latitude": 51.379192, "longitude": -2.363148 },
                    { "latitude": 51.379162, "longitude": -2.362465 },
                    { "latitude": 51.379147, "longitude": -2.362291 },
                    { "latitude": 51.379124, "longitude": -2.362149 },
                    { "latitude": 51.378891, "longitude": -2.361121 },
                    { "latitude": 51.378865, "longitude": -2.360790 },
                    { "latitude": 51.378862, "longitude": -2.360639 },
                    { "latitude": 51.378868, "longitude": -2.360537 },
                    { "latitude": 51.378891, "longitude": -2.360463 },
                    { "latitude": 51.378923, "longitude": -2.360399 },
                    { "latitude": 51.378357, "longitude": -2.359761 },
                    { "latitude": 51.378312, "longitude": -2.359730 },
                    { "latitude": 51.378264, "longitude": -2.359724 },
                    { "latitude": 51.378168, "longitude": -2.359733 },
                    { "latitude": 51.378003, "longitude": -2.359743 }
                ]
            },
            {
                "sectionId": 10,
                "sectionDescription": "Start: PinesWay; End: LowerOldfieldPark",
                "positions": [
                    { "latitude": 51.380437, "longitude": -2.370557 },
                    { "latitude": 51.380307, "longitude": -2.370483 },
                    { "latitude": 51.380156, "longitude": -2.370436 },
                    { "latitude": 51.379932, "longitude": -2.370785 },
                    { "latitude": 51.379881, "longitude": -2.370778 },
                    { "latitude": 51.379829, "longitude": -2.370761 },
                    { "latitude": 51.379683, "longitude": -2.370688 },
                    { "latitude": 51.379595, "longitude": -2.370446 },
                    { "latitude": 51.379544, "longitude": -2.370321 },
                    { "latitude": 51.379403, "longitude": -2.369894 },
                    { "latitude": 51.379378, "longitude": -2.369822 },
                    { "latitude": 51.379354, "longitude": -2.369737 },
                    { "latitude": 51.379083, "longitude": -2.368962 },
                    { "latitude": 51.378911, "longitude": -2.368459 }
                ]
            },
            {
                "sectionId": 11,
                "sectionDescription": "Start: NorthParade; End: BathAbbey",
                "positions": [
                    { "latitude": 51.380821, "longitude": -2.357195 },
                    { "latitude": 51.381503, "longitude": -2.357510 }
                ]
            },
            {
                "sectionId": 12,
                "sectionDescription": "Start: BathAbbey; End: PultneyBridge",
                "positions": [
                    { "latitude": 51.381503, "longitude": -2.357510 },
                    { "latitude": 51.381523, "longitude": -2.357658 },
                    { "latitude": 51.381528, "longitude": -2.357801 },
                    { "latitude": 51.381515, "longitude": -2.357926 },
                    { "latitude": 51.381514, "longitude": -2.358011 },
                    { "latitude": 51.381529, "longitude": -2.358103 },
                    { "latitude": 51.381549, "longitude": -2.358146 },
                    { "latitude": 51.381578, "longitude": -2.358189 },
                    { "latitude": 51.381631, "longitude": -2.358239 },
                    { "latitude": 51.381667, "longitude": -2.358287 },
                    { "latitude": 51.381692, "longitude": -2.358347 },
                    { "latitude": 51.381722, "longitude": -2.358517 },
                    { "latitude": 51.381741, "longitude": -2.358723 },
                    { "latitude": 51.381773, "longitude": -2.358910 },
                    { "latitude": 51.381827, "longitude": -2.358976 },
                    { "latitude": 51.381888, "longitude": -2.359021 },
                    { "latitude": 51.381960, "longitude": -2.359053 },
                    { "latitude": 51.382246, "longitude": -2.359133 },
                    { "latitude": 51.382537, "longitude": -2.359203 },
                    { "latitude": 51.382574, "longitude": -2.359199 },
                    { "latitude": 51.382605, "longitude": -2.359188 },
                    { "latitude": 51.382709, "longitude": -2.359095 },
                    { "latitude": 51.382758, "longitude": -2.358968 },
                    { "latitude": 51.382828, "longitude": -2.358581 },
                    { "latitude": 51.382890, "longitude": -2.358286 },
                ]
            },
            {
                "sectionId": 13,
                "sectionDescription": "Start: PultneyBridge; End: BathAbbey",
                "positions": [
                    { "latitude": 51.382890, "longitude": -2.358286 },
                    { "latitude": 51.382781, "longitude": -2.358153 },
                    { "latitude": 51.382165, "longitude": -2.357347 },
                    { "latitude": 51.382148, "longitude": -2.357333 },
                    { "latitude": 51.382125, "longitude": -2.357319 },
                    { "latitude": 51.382093, "longitude": -2.357312 },
                    { "latitude": 51.382061, "longitude": -2.357321 },
                    { "latitude": 51.382031, "longitude": -2.357338 },
                    { "latitude": 51.382015, "longitude": -2.357354 },
                    { "latitude": 51.381894, "longitude": -2.357574 },
                    { "latitude": 51.381873, "longitude": -2.357600 },
                    { "latitude": 51.381850, "longitude": -2.357615 },
                    { "latitude": 51.381812, "longitude": -2.357631 },
                    { "latitude": 51.381740, "longitude": -2.357629 },
                    { "latitude": 51.381701, "longitude": -2.357613 },
                    { "latitude": 51.381503, "longitude": -2.357510 }
                ]
            },
            {
                "sectionId": 14,
                "sectionDescription": "Start: PultneyBridge; End: BottomOfBathwickHill",
                "positions": [
                    { "latitude": 51.382890, "longitude": -2.358286 },
                    { "latitude": 51.383275, "longitude": -2.357223 },
                    { "latitude": 51.383312, "longitude": -2.357129 },
                    { "latitude": 51.383618, "longitude": -2.356372 },
                    { "latitude": 51.383636, "longitude": -2.356380 },
                    { "latitude": 51.383652, "longitude": -2.356379 },
                    { "latitude": 51.383666, "longitude": -2.356370 },
                    { "latitude": 51.383674, "longitude": -2.356357 },
                    { "latitude": 51.383682, "longitude": -2.356343 },
                    { "latitude": 51.383687, "longitude": -2.356316 },
                    { "latitude": 51.383688, "longitude": -2.356295 },
                    { "latitude": 51.383684, "longitude": -2.356273 },
                    { "latitude": 51.383675, "longitude": -2.356256 },
                    { "latitude": 51.383663, "longitude": -2.356238 },
                    { "latitude": 51.384061, "longitude": -2.355231 },
                    { "latitude": 51.384300, "longitude": -2.354630 },
                    { "latitude": 51.384598, "longitude": -2.353879 },
                    { "latitude": 51.384909, "longitude": -2.353089 },
                    { "latitude": 51.384479, "longitude": -2.352680 },
                    { "latitude": 51.384092, "longitude": -2.352317 },
                    { "latitude": 51.384062, "longitude": -2.352276 },
                    { "latitude": 51.384042, "longitude": -2.352239 },
                    { "latitude": 51.384024, "longitude": -2.352187 },
                    { "latitude": 51.384011, "longitude": -2.352117 },
                    { "latitude": 51.384014, "longitude": -2.352018 },
                    { "latitude": 51.384027, "longitude": -2.351941 },
                    { "latitude": 51.384087, "longitude": -2.351580 },
                    { "latitude": 51.384108, "longitude": -2.351580 },
                    { "latitude": 51.384129, "longitude": -2.351570 },
                    { "latitude": 51.384156, "longitude": -2.351541 },
                    { "latitude": 51.384182, "longitude": -2.351491 },
                    { "latitude": 51.384191, "longitude": -2.351449 },
                    { "latitude": 51.384192, "longitude": -2.351400 },
                    { "latitude": 51.384184, "longitude": -2.351347 },
                    { "latitude": 51.384170, "longitude": -2.351310 },
                    { "latitude": 51.384141, "longitude": -2.351268 },
                    { "latitude": 51.384118, "longitude": -2.351254 },
                    { "latitude": 51.384092, "longitude": -2.351251 },
                    { "latitude": 51.384072, "longitude": -2.351252 }
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
                    { "latitude": 51.378392, "longitude": -2.376585 }
                ]
            },
            {
                "sectionId": 16,
                "sectionDescription": "Start: Roundabout; End: NorthParade",
                "positions": [
                    { "latitude": 51.377169, "longitude": -2.359606 },
                    { "latitude": 51.377088, "longitude": -2.359468 },
                    { "latitude": 51.377065, "longitude": -2.359420 },
                    { "latitude": 51.377049, "longitude": -2.359375 },
                    { "latitude": 51.377037, "longitude": -2.359308 },
                    { "latitude": 51.377029, "longitude": -2.359240 },
                    { "latitude": 51.377026, "longitude": -2.359171 },
                    { "latitude": 51.377035, "longitude": -2.358815 },
                    { "latitude": 51.377023, "longitude": -2.358432 },
                    { "latitude": 51.376980, "longitude": -2.358055 },
                    { "latitude": 51.376938, "longitude": -2.357812 },
                    { "latitude": 51.376840, "longitude": -2.357406 },
                    { "latitude": 51.376803, "longitude": -2.357230 },
                    { "latitude": 51.376773, "longitude": -2.357035 },
                    { "latitude": 51.376755, "longitude": -2.356874 },
                    { "latitude": 51.376742, "longitude": -2.356628 },
                    { "latitude": 51.376741, "longitude": -2.356552 },
                    { "latitude": 51.376757, "longitude": -2.356293 },
                    { "latitude": 51.376844, "longitude": -2.355793 },
                    { "latitude": 51.376951, "longitude": -2.355061 },
                    { "latitude": 51.376948, "longitude": -2.354457 },
                    { "latitude": 51.376959, "longitude": -2.354217 },
                    { "latitude": 51.376970, "longitude": -2.354096 },
                    { "latitude": 51.376988, "longitude": -2.353961 },
                    { "latitude": 51.377249, "longitude": -2.352910 },
                    { "latitude": 51.377327, "longitude": -2.352580 },
                    { "latitude": 51.377371, "longitude": -2.352442 },
                    { "latitude": 51.377420, "longitude": -2.352300 },
                    { "latitude": 51.377521, "longitude": -2.352054 },
                    { "latitude": 51.377826, "longitude": -2.351732 },
                    { "latitude": 51.378344, "longitude": -2.351227 },
                    { "latitude": 51.378419, "longitude": -2.351169 },
                    { "latitude": 51.378481, "longitude": -2.351129 },
                    { "latitude": 51.378544, "longitude": -2.351105 },
                    { "latitude": 51.378582, "longitude": -2.351094 },
                    { "latitude": 51.378652, "longitude": -2.351083 },
                    { "latitude": 51.378726, "longitude": -2.351077 },
                    { "latitude": 51.378866, "longitude": -2.351077 },
                    { "latitude": 51.378946, "longitude": -2.351086 },
                    { "latitude": 51.379009, "longitude": -2.351094 },
                    { "latitude": 51.379097, "longitude": -2.351114 },
                    { "latitude": 51.379560, "longitude": -2.351193 },
                    { "latitude": 51.379685, "longitude": -2.351209 },
                    { "latitude": 51.379767, "longitude": -2.351213 },
                    { "latitude": 51.380930, "longitude": -2.351281 }
                ]
            },
            {
                "sectionId": 17,
                "sectionDescription": "Start: Northparade; End: Roundabout",
                "positions": [
                    { "latitude": 51.380930, "longitude": -2.351281 },
                    { "latitude": 51.379767, "longitude": -2.351213 },
                    { "latitude": 51.379685, "longitude": -2.351209 },
                    { "latitude": 51.379560, "longitude": -2.351193 },
                    { "latitude": 51.379097, "longitude": -2.351114 },
                    { "latitude": 51.379009, "longitude": -2.351094 },
                    { "latitude": 51.378946, "longitude": -2.351086 },
                    { "latitude": 51.378866, "longitude": -2.351077 },
                    { "latitude": 51.378726, "longitude": -2.351077 },
                    { "latitude": 51.378652, "longitude": -2.351083 },
                    { "latitude": 51.378582, "longitude": -2.351094 },
                    { "latitude": 51.378544, "longitude": -2.351105 },
                    { "latitude": 51.378481, "longitude": -2.351129 },
                    { "latitude": 51.378419, "longitude": -2.351169 },
                    { "latitude": 51.378344, "longitude": -2.351227 },
                    { "latitude": 51.377826, "longitude": -2.351732 },
                    { "latitude": 51.377521, "longitude": -2.352054 },
                    { "latitude": 51.377420, "longitude": -2.352300 },
                    { "latitude": 51.377371, "longitude": -2.352442 },
                    { "latitude": 51.377327, "longitude": -2.352580 },
                    { "latitude": 51.377249, "longitude": -2.352910 },
                    { "latitude": 51.376988, "longitude": -2.353961 },
                    { "latitude": 51.376970, "longitude": -2.354096 },
                    { "latitude": 51.376959, "longitude": -2.354217 },
                    { "latitude": 51.376948, "longitude": -2.354457 },
                    { "latitude": 51.376951, "longitude": -2.355061 },
                    { "latitude": 51.376898, "longitude": -2.355406 },
                    { "latitude": 51.376782, "longitude": -2.355735 },
                    { "latitude": 51.376620, "longitude": -2.356208 },
                    { "latitude": 51.376611, "longitude": -2.356264 },
                    { "latitude": 51.376606, "longitude": -2.356601 },
                    { "latitude": 51.376622, "longitude": -2.356800 },
                    { "latitude": 51.376652, "longitude": -2.356998 },
                    { "latitude": 51.376691, "longitude": -2.357177 },
                    { "latitude": 51.376813, "longitude": -2.357620 },
                    { "latitude": 51.376852, "longitude": -2.357756 },
                    { "latitude": 51.376878, "longitude": -2.357879 },
                    { "latitude": 51.376921, "longitude": -2.358101 },
                    { "latitude": 51.376959, "longitude": -2.358436 },
                    { "latitude": 51.376971, "longitude": -2.358747 },
                    { "latitude": 51.376980, "longitude": -2.359505 },
                    { "latitude": 51.376992, "longitude": -2.359663 },
                    { "latitude": 51.377004, "longitude": -2.359801 },
                ]
            },
            {
                "sectionId": 18,
                "sectionDescription": "Roundabout at bottomOfBathwickHill",
                "positions": [
                    { "latitude": 51.383982, "longitude": -2.351402 },
                    { "latitude": 51.383982, "longitude": -2.351441 },
                    { "latitude": 51.383992, "longitude": -2.351484 },
                    { "latitude": 51.384009, "longitude": -2.351526 },
                    { "latitude": 51.384024, "longitude": -2.351550 },
                    { "latitude": 51.384042, "longitude": -2.351565 },
                    { "latitude": 51.384059, "longitude": -2.351576 },
                    { "latitude": 51.384079, "longitude": -2.351581 },
                    { "latitude": 51.384087, "longitude": -2.351580 },
                    { "latitude": 51.384108, "longitude": -2.351580 },
                    { "latitude": 51.384129, "longitude": -2.351570 },
                    { "latitude": 51.384156, "longitude": -2.351541 },
                    { "latitude": 51.384182, "longitude": -2.351491 },
                    { "latitude": 51.384191, "longitude": -2.351449 },
                    { "latitude": 51.384192, "longitude": -2.351400 },
                    { "latitude": 51.384184, "longitude": -2.351347 },
                    { "latitude": 51.384170, "longitude": -2.351310 },
                    { "latitude": 51.384141, "longitude": -2.351268 },
                    { "latitude": 51.384118, "longitude": -2.351254 },
                    { "latitude": 51.384092, "longitude": -2.351251 },
                    { "latitude": 51.384072, "longitude": -2.351252 }
                ]
            }
        ]; //oiafhsaoidhjsadnaosi
        var roundaboutCoords = [
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
        var routes = [
            {
                busRouteName: "U1",
                sections: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 18],
                colour: this.colors[1]
            },
            {
                busRouteName: "U2",
                sections: [0, 1, 2, 15, 6, 8, 10, 16, 18],
                colour: this.colors[2]
            },
            {
                busRouteName: "U1X",
                sections: [0, 1, 2, 17, 6, 7, 8, 10, 16, 18],
                colour: this.colors[3]
            }
        ];
        routes.forEach(function (_a) {
            var busRouteName = _a.busRouteName, sections = _a.sections, colour = _a.colour;
            sections.forEach(function (section) {
                var busRoutePath = exampleBusRouteCoordinates[section].positions;
                var googleMapStyle = busRoutePath.map(function (_a) {
                    var latitude = _a.latitude, longitude = _a.longitude;
                    return { lat: latitude, lng: longitude };
                });
                var busRoute = new google.maps.Polyline({
                    path: googleMapStyle,
                    geodesic: true,
                    strokeColor: colour,
                    strokeOpacity: 0.8,
                    strokeWeight: 3
                });
                _this.busRouteLines.set(busRouteName, busRoute);
                busRoute.setMap(_this.map);
            });
        });
        var roundabout = new google.maps.Polygon({
            paths: roundaboutCoords,
            strokeColor: '#505050',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#505050',
            fillOpacity: 0
        });
        roundabout.setMap(this.map);
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
                        timeToAnimate = 300;
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
        __metadata("design:paramtypes", [NavController, NavParams, ModalController, ServerProvider])
    ], MapPage);
    return MapPage;
}());
export { MapPage };
//# sourceMappingURL=map.js.map