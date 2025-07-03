import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // برای ngIf/ngFor (اگر در قالب استفاده شود)

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule], // CommonModule را اضافه کنید
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h2>در حال ورود...</h2>
      <p>لطفاً صبر کنید.</p>
      <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    </div>
  `,
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const jwtToken = params['token'];
      const error = params['error'];

      if (jwtToken) {
        // توکن را در Local Storage ذخیره کنید
        localStorage.setItem('jwtToken', jwtToken);
        console.log('JWT Token received and stored from AuthCallback:', jwtToken);
        // هدایت به داشبورد
        this.router.navigate(['/dashboard']);
      } else if (error) {
        // اگر خطایی در URL بود
        this.errorMessage = 'خطا در احراز هویت: ' + error;
        console.error('Authentication callback error:', error);
        // می‌توانید کاربر را به صفحه لاگین هدایت کنید
        this.router.navigate(['/login'], { queryParams: { error: 'oauth_token_missing' } });
      } else {
        this.errorMessage = 'توکن احراز هویت دریافت نشد. لطفاً دوباره تلاش کنید.';
        this.router.navigate(['/login'], { queryParams: { error: 'oauth_token_missing' } });
      }
    });
  }
}
