import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

export const HOST: string = 'http://localhost:8080/api';

platformBrowserDynamic().bootstrapModule(AppModule);
