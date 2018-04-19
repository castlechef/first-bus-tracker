import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

export const HOST: string = '10.0.0.2:8080';

platformBrowserDynamic().bootstrapModule(AppModule);
