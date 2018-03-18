import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Page2} from './page2';
import {IonicModule, NavController, Platform} from 'ionic-angular/index';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {PlatformMock, SplashScreenMock, StatusBarMock} from '../../../test-config/mocks-ionic';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {} from 'jasmine';

describe('Page2', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Page2],
      imports: [
        IonicModule.forRoot(Page2)
      ],
      providers: [
        NavController,
        HttpClient,
        HttpHandler,
        {provide: Platform, useClass: PlatformMock},
        {provide: StatusBar, useClass: StatusBarMock},
        {provide: SplashScreen, useClass: SplashScreenMock},
      ]
    });
  });

  it('should have locations in title', () => {
    const fixture = TestBed.createComponent(Page2);
    const comp = fixture.componentInstance;
    const element: HTMLElement = fixture.debugElement.query(By.css('.toolbar-title')).nativeElement;
    expect(element.innerText).toMatch(/locations/i, 'Title should say something about locations');
  });
});
