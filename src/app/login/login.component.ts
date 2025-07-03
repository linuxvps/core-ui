import {Component, OnInit} from '@angular/core'; // OnInit را اضافه کنید
import {HttpClient, HttpClientModule} from '@angular/common/http'; // HttpClientModule را اضافه کنید
import {Router, ActivatedRoute, RouterModule} from '@angular/router'; // RouterModule را اضافه کنید
import {FormsModule} from '@angular/forms'; // FormsModule را اضافه کنید
import {CommonModule} from '@angular/common'; // CommonModule را اضافه کنید (برای ngIf)

@Component({
  selector: 'app-login',
  standalone: true, // این کامپوننت مستقل است
  imports: [
    CommonModule,
    FormsModule, // برای [(ngModel)]
    HttpClientModule, // برای استفاده از HttpClient
    RouterModule // اگر در قالب از routerLink استفاده می‌کنید
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit { // OnInit را implements کنید
  username!: string;
  password!: string;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    // برای نمایش پیام‌های خطا یا موفقیت از URL
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        this.errorMessage = 'نام کاربری یا رمز عبور اشتباه است یا دسترسی غیرمجاز.';
      } else if (params['logout']) {
        this.successMessage = 'شما با موفقیت خارج شدید.';
      } else if (params['session_expired']) {
        this.errorMessage = 'نشست شما منقضی شده است، لطفاً دوباره وارد شوید.';
      } else if (params['unauthorized']) {
        this.errorMessage = 'شما مجاز به دسترسی به این صفحه نیستید، لطفاً دوباره وارد شوید.';
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null; // پاک کردن پیام‌های قبلی
    this.successMessage = null;

    // ارسال درخواست POST به بک‌اند Spring Boot
    this.http.post<any>('http://localhost:8080/authenticate', {username: this.username, password: this.password})
      .subscribe({
        next: (response) => {
          // ذخیره JWT Token در Local Storage مرورگر
          localStorage.setItem('jwtToken', response.jwt);
          console.log('JWT Token stored:', response.jwt);
          this.successMessage = 'ورود موفقیت آمیز بود!';
          // هدایت به داشبورد Angular (مسیر در Angular Routing)
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'نام کاربری یا رمز عبور اشتباه است.';
          } else {
            // پیام خطا را از بدنه پاسخ HTTP دریافت کنید
            this.errorMessage = 'خطا در ورود به سیستم: ' + (error.error?.message || error.message);
          }
        }
      });
  }
}
