import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      // اگر توکن وجود دارد، آن را به هدر Authorization اضافه کنید
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          console.error('Unauthorized or Forbidden access. Redirecting to login.', error);
          localStorage.removeItem('jwtToken'); // حذف توکن نامعتبر
          this.router.navigate(['/login'], { queryParams: { error: 'session_expired' } }); // هدایت به لاگین
        }
        return throwError(() => error); // پرتاب مجدد خطا
      })
    );
  }
}
