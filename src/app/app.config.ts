import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideSicTheme, provideSicConfig } from 'sic-ng';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideCharts(withDefaultRegisterables()),
    provideSicTheme({
      mode: 'system',
      theme: 'default',
      colorPrimary: '#6366f1',
      colorSuccess: '#10b981',
      colorDanger: '#ef4444',
      colorWarning: '#f59e0b',
      radiusMd: '0.625rem',
      fontSans: "'Kanit', 'Inter', system-ui, sans-serif",
    }),
    provideSicConfig({
      decimals: 2,
      dateFormat: 'dd/MM/yyyy',
      era: 'CE',
    }),
  ],
};
