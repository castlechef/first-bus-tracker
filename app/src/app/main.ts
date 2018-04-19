import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

export const HOST: string = 'localhost:8080';

platformBrowserDynamic().bootstrapModule(AppModule);
