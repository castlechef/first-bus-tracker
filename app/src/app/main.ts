import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

export const HOST: string = 'https://firstbustracker.ddns.net/api';

platformBrowserDynamic().bootstrapModule(AppModule);
