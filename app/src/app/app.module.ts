import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Page1 } from '../pages/page1/page1';

import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { BusRouteProvider } from '../providers/bus-route/bus-route';
import {Page2} from '../pages/page2/page2';
import {MapPageModule} from '../pages/map/map.module';
import {BusPageModule} from '../pages/bus/bus.module';
import {BusStopPageModule} from '../pages/bus-stop/bus-stop.module';
import {BusStopListPageModule} from '../pages/bus-stop-list/bus-stop-list.module';
import {MapOptionsPopoverPageModule} from '../pages/map-options-popover/map-options-popover.module';
import { SettingsProvider } from '../providers/settings/settings';
import { IonicStorageModule } from '@ionic/storage';
import {MapPage} from '../pages/map/map';
import {BusPage} from '../pages/bus/bus';
import {BusStopPage} from '../pages/bus-stop/bus-stop';
import {MapOptionsPopoverPage} from '../pages/map-options-popover/map-options-popover';
import {BusStopListPage} from '../pages/bus-stop-list/bus-stop-list';
import { BusStopProvider } from '../providers/bus-stop/bus-stop';
import { BusProvider } from '../providers/bus/bus';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, { links: [] }),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    MapPageModule,
    BusPageModule,
    BusStopPageModule,
    BusStopListPageModule,
    MapOptionsPopoverPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BrowserModule,
    HttpClient,
    HttpClientModule,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BusRouteProvider,
    SettingsProvider,
    BusStopProvider,
    BusProvider
  ]
})
export class AppModule { }
