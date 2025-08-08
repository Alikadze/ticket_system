import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MockData } from './core/data/mock-data';


export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideClientHydration(withEventReplay()),
		provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        }),
		provideHttpClient(withFetch()),

		MessageService,

		importProvidersFrom(InMemoryWebApiModule.forRoot(MockData, {delay: 500}))
	]
};
