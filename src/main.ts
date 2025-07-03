// 📁 src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component'; // حذف شود

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {AuthInterceptor} from './app/auth-interceptor';
import {LoginComponent} from './app/login/login.component';


bootstrapApplication(LoginComponent, { // تغییر از AppComponent به LoginComponent
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideRouter(routes),
    importProvidersFrom(FormsModule)
  ]
}).catch((err) => console.error(err));
