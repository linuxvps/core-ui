import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthInterceptor } from './auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // فراهم کردن مسیرهای برنامه
    provideRouter(routes),

    // فراهم کردن HttpClient و فعال کردن شناسایی Interceptor های مبتنی بر کلاس
    provideHttpClient(withInterceptorsFromDi()),

    // ثبت کردن AuthInterceptor به عنوان یک HTTP Interceptor
    // این روش استاندارد برای Interceptor های مبتنی بر کلاس است
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ]
};
