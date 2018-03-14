import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Page1 } from './page1';
import { IonicModule, Platform, NavController } from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock } from '../../../test-config/mocks-ionic';
describe('Page1', function () {
    var de;
    var comp;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [Page1],
            imports: [
                IonicModule.forRoot(Page1)
            ],
            providers: [
                NavController,
                { provide: Platform, useClass: PlatformMock },
                { provide: StatusBar, useClass: StatusBarMock },
                { provide: SplashScreen, useClass: SplashScreenMock },
            ]
        });
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(Page1);
        comp = fixture.componentInstance;
        de = fixture.debugElement.query(By.css('h3'));
    });
    it('should create component', function () { return expect(comp).toBeDefined(); });
    it('should have expected <h3> text', function () {
        fixture.detectChanges();
        var h3 = de.nativeElement;
        expect(h3.innerText).toMatch(/ionic/i, '<h3> should say something about "Ionic"');
    });
    it('should show the favicon as <img>', function () {
        fixture.detectChanges();
        var img = fixture.debugElement.query(By.css('img')).nativeElement;
        expect(img.src).toContain('assets/icon/favicon.ico');
    });
});
//# sourceMappingURL=page1.spec.js.map