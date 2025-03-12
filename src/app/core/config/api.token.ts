import { InjectionToken } from '@angular/core';
import { environment } from '../../../environment/environment';

export const API_URL = new InjectionToken<string>('apiUrl', {
  providedIn: 'root',
  factory: () => environment.apiUrl
});