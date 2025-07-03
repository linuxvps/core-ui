// 📁 src/app/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { AuthService } from './auth.service'; // بهتر است منطق توکن در یک سرویس باشد

/**
 * این Interceptor درخواست‌های HTTP خروجی را رهگیری کرده و دو کار اصلی انجام می‌دهد:
 * 1. اگر توکن احراز هویت (JWT) موجود باشد، آن را به هدر 'Authorization' اضافه می‌کند.
 * 2. در صورت بروز خطای 401 (Unauthorized) یا 403 (Forbidden)، کاربر را به صفحه لاگین هدایت می‌کند.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // به جای دسترسی مستقیم به localStorage، بهتر است از یک سرویس برای مدیریت توکن استفاده شود.
  // constructor(private router: Router, private authService: AuthService) {}
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // شبیه‌سازی دریافت توکن از یک سرویس
    // const token = this.authService.getToken();
    const token = localStorage.getItem('jwtToken');

    // اگر توکن وجود داشت، یک کپی از درخواست با هدر جدید ایجاد می‌کنیم
    if (token) {
      // request.clone() مهم است زیرا درخواست‌ها غیرقابل تغییر (immutable) هستند
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // درخواست را به handler بعدی ارسال کرده و خطاها را مدیریت می‌کنیم
    return next.handle(request).pipe(
      catchError((error: unknown) => {
        // فقط خطاهای از نوع HttpErrorResponse را بررسی می‌کنیم
        if (error instanceof HttpErrorResponse) {
          // اگر وضعیت خطا 401 (عدم احراز هویت) یا 403 (عدم دسترسی) بود
          if (error.status === 401 || error.status === 403) {
            console.error('Unauthorized/Forbidden request. Redirecting to login...', error);

            // توکن نامعتبر را از حافظه پاک می‌کنیم
            // this.authService.logout();
            localStorage.removeItem('jwtToken');

            // کاربر را به صفحه لاگین هدایت می‌کنیم
            this.router.navigate(['/login'], {
              queryParams: {
                returnUrl: this.router.url, // می‌توان آدرس فعلی را برای بازگشت بعد از لاگین ذخیره کرد
                error: 'session-expired'
              }
            });
          }
        }

        // خطا را برای سایر error handler ها ارسال می‌کنیم
        return throwError(() => error);
      })
    );
  }
}
