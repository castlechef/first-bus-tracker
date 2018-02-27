"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var ionic_angular_1 = require("ionic-angular");
var status_bar_1 = require("@ionic-native/status-bar");
var splash_screen_1 = require("@ionic-native/splash-screen");
var app_component_1 = require("./app.component");
var mocks_ionic_1 = require("../../test-config/mocks-ionic");
describe('MyApp Component', function () {
    var fixture;
    var component;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [app_component_1.MyApp],
            imports: [
                ionic_angular_1.IonicModule.forRoot(app_component_1.MyApp)
            ],
            providers: [
                { provide: status_bar_1.StatusBar, useClass: mocks_ionic_1.StatusBarMock },
                { provide: splash_screen_1.SplashScreen, useClass: mocks_ionic_1.SplashScreenMock },
                { provide: ionic_angular_1.Platform, useClass: mocks_ionic_1.PlatformMock }
            ]
        });
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(app_component_1.MyApp);
        component = fixture.componentInstance;
    });
    it('should be created', function () {
        expect(component instanceof app_component_1.MyApp).toBe(true);
    });
    it('should have two pages', function () {
        expect(component.pages.length).toBe(3);
    });
});
