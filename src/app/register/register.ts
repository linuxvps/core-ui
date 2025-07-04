import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// یک validator سفارشی برای بررسی تطابق رمز عبور
function passwordMatcher(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // برای فرم‌های reactive
    RouterModule         // برای routerLink
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // DTO شما username را به عنوان ایمیل در نظر می‌گیرد
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatcher }); // اعمال validator سفارشی
  }

  /**
   * Handles the registration form submission.
   */
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      // علامت‌گذاری فیلدها برای نمایش خطاها
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // فقط نام کاربری و رمز عبور را ارسال می‌کنیم، مطابق با CreateUserRequest
    const requestPayload = {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
      // نقش‌ها معمولاً در بک‌اند به صورت پیش‌فرض (مثلاً 'USER') تعیین می‌شوند
    };

    this.http.post('http://localhost:8080/api/users', requestPayload, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = "Registration successful! You will be redirected to the login page.";
          // پس از چند ثانیه، کاربر را به صفحه لاگین هدایت می‌کنیم
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.error) {
            // نمایش پیام خطایی که از بک‌اند می‌آید
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'An unknown error occurred during registration. Please try again.';
          }
          console.error('Registration failed:', err);
        }
      });
  }
}
