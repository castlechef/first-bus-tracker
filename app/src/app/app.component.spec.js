import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';
import { PlatformMock, SplashScreenMock, StatusBarMock } from '../../test-config/mocks-ionic';
describe('MyApp Component', function () {
    var fixture;
    var component;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [MyApp],
            imports: [
                IonicModule.forRoot(MyApp)
            ],
            providers: [
                { provide: StatusBar, useClass: StatusBarMock },
                { provide: SplashScreen, useClass: SplashScreenMock },
                { provide: Platform, useClass: PlatformMock }
            ]
        });
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(MyApp);
        component = fixture.componentInstance;
    });
    it('should be created', function () {
        expect(component instanceof MyApp).toBe(true);
    });
    it('should have two pages', function () {
        expect(component.pages.length).toBe(3);
    });
});
//# sourceMappingURL=app.component.spec.js.map