// 📁 src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; // مسیر AppComponent شما (در src/app/app.ts)
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './app/auth-interceptor'; // مسیر AuthInterceptor شما (در src/app/auth-interceptor.ts)

bootstrapApplication(AppComponent, { // بوت‌استرپ کردن AppComponent به عنوان کامپوننت روت
  providers: [
    // فراهم کردن HttpClient و ثبت Functional Interceptor
    provideHttpClient(withInterceptors([AuthInterceptor])),
    // فراهم کردن Router برای مدیریت مسیرها
    provideRouter(routes),
    // وارد کردن FormsModule برای استفاده از ngModel
    importProvidersFrom(FormsModule)
  ]
}).catch((err) => console.error(err));
