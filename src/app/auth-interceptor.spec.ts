// 📁 src/app/auth-interceptor.spec.ts
import {TestBed} from '@angular/core/testing';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS} from '@angular/common/http';
import {Router} from '@angular/router';

import {AuthInterceptor} from './auth-interceptor';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let router: Router;

  // یک mock برای Router ایجاد می‌کنیم تا بتوانیم متد navigate را spy کنیم
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    get url() {
      return '/protected/resource';
    }
  };

  // تابع کمکی برای راه‌اندازی TestBed با یا بدون توکن
  const setupTestBed = (token: string | null) => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'jwtToken') {
        return token;
      }
      return null;
    });

    spyOn(localStorage, 'removeItem');

    TestBed.configureTestingModule({
      providers: [
        // روش جدید و استاندارد برای فراهم کردن HttpClient و ابزارهای تست آن
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  };

  afterEach(() => {
    // اطمینان حاصل می‌کند که هیچ درخواست معلقی وجود ندارد
    httpMock.verify();
    // ریست کردن spy ها بعد از هر تست
    routerMock.navigate.calls.reset();
  });

  describe('with a JWT token', () => {
    const testToken = 'my-secret-test-token';

    beforeEach(() => {
      setupTestBed(testToken);
    });

    it('should add an Authorization header to the request', () => {
      httpClient.get('/api/data').subscribe();

      const httpRequest = httpMock.expectOne('/api/data');

      expect(httpRequest.request.headers.has('Authorization')).toBe(true);
      expect(httpRequest.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);

      httpRequest.flush({});
    });
  });

  describe('without a JWT token', () => {
    beforeEach(() => {
      setupTestBed(null);
    });

    it('should not add an Authorization header to the request', () => {
      httpClient.get('/api/data').subscribe();

      const httpRequest = httpMock.expectOne('/api/data');

      expect(httpRequest.request.headers.has('Authorization')).toBe(false);

      httpRequest.flush({});
    });
  });

  describe('handling HTTP errors', () => {
    beforeEach(() => {
      setupTestBed('any-token');
    });

    it('should redirect to /login on 401 Unauthorized error', () => {
      const testUrl = '/api/protected-data';

      httpClient.get(testUrl).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
        }
      });

      const httpRequest = httpMock.expectOne(testUrl);
      httpRequest.flush('Unauthorized', {status: 401, statusText: 'Unauthorized'});

      expect(localStorage.removeItem).toHaveBeenCalledWith('jwtToken');
      expect(router.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: {
          returnUrl: '/protected/resource',
          error: 'session-expired'
        }
      });
    });

    it('should not redirect on other errors (e.g., 500)', () => {
      const testUrl = '/api/server-error';

      httpClient.get(testUrl).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      });

      const httpRequest = httpMock.expectOne(testUrl);
      httpRequest.flush('Server Error', {status: 500, statusText: 'Server Error'});

      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
