import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './user.routes';

export const contactConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};