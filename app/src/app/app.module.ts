import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ServerProvider} from '../providers/server-provider';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MapPage } from '../pages/map/map';
import { Geolocation } from '@ionic-native/geolocation';
import {BusStopPage} from '../pages/bus-stop/bus-stop';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    MapPage,
    BusStopPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, { links: [] }),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    MapPage,
    BusStopPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BrowserModule,
    HttpClient,
    HttpClientModule,
    ServerProvider,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler }

  ]
})
export class AppModule { }
