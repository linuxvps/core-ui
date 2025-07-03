import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // برای [(ngModel)]
    RouterModule // اگر در قالب از routerLink استفاده می‌کنید
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username!: string;
  password!: string;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // بررسی پارامترهای کوئری در URL برای پیام‌ها (از ریدایرکت‌های Spring Boot)
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        // مدیریت انواع پیام‌های خطا از Spring Boot یا منطق سفارشی
        if (params['error'] === 'oauth_failed') {
          this.errorMessage = 'ورود با گوگل ناموفق بود. لطفاً دوباره تلاش کنید.';
        } else if (params['user_processing_failed']) {
          this.errorMessage = 'خطا در پردازش اطلاعات کاربری گوگل. لطفاً با پشتیبانی تماس بگیرید.';
        } else if (params['oauth_token_missing']) { // خطای جدید از AuthCallbackComponent
          this.errorMessage = 'توکن احراز هویت گوگل دریافت نشد. لطفاً دوباره تلاش کنید.';
        }
        else {
          this.errorMessage = 'نام کاربری یا رمز عبور اشتباه است یا دسترسی غیرمجاز.';
        }
      } else if (params['logout']) {
        this.successMessage = 'شما با موفقیت خارج شدید.';
      } else if (params['session_expired']) {
        this.errorMessage = 'نشست شما منقضی شده است، لطفاً دوباره وارد شوید.';
      } else if (params['unauthorized']) {
        this.errorMessage = 'شما مجاز به دسترسی به این صفحه نیستید، لطفاً دوباره وارد شوید.';
      }

      // نکته: مدیریت توکن JWT از OAuth2 Callback
      // این بخش دیگر در اینجا لازم نیست زیرا AuthCallbackComponent مسئول آن است.
      // const token = params['token'];
      // if (token) {
      //   localStorage.setItem('jwtToken', token);
      //   console.log('JWT Token received from OAuth2 callback and stored:', token);
      //   this.successMessage = 'ورود با گوگل موفقیت آمیز بود!';
      //   this.router.navigate(['/dashboard']);
      // }
    });
  }

  /**
   * Handles traditional username/password login.
   * Sends a POST request to the Spring Boot backend to authenticate.
   */
  onSubmit(): void {
    this.errorMessage = null; // پاک کردن پیام‌های قبلی
    this.successMessage = null;

    // ارسال درخواست POST به بک‌اند Spring Boot برای احراز هویت
    this.http.post<any>('http://localhost:8080/authenticate', { username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          // ذخیره JWT Token در Local Storage مرورگر
          localStorage.setItem('jwtToken', response.jwt);
          console.log('JWT Token stored:', response.jwt);
          this.successMessage = 'ورود موفقیت آمیز بود!';
          // هدایت به مسیر داشبورد Angular
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'نام کاربری یا رمز عبور اشتباه است.';
          } else {
            // دریافت پیام خطا از بدنه پاسخ HTTP در صورت وجود
            this.errorMessage = 'خطا در ورود به سیستم: ' + (error.error?.message || error.message || 'خطای ناشناخته');
          }
        }
      });
  }

  /**
   * Initiates the Google OAuth2 login flow.
   * Redirects the browser to the Spring Boot OAuth2 authorization endpoint.
   */
  loginWithGoogle(): void {
    this.errorMessage = null;
    this.successMessage = null;
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }
}
