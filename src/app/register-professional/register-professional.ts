import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// A custom validator to check that two fields match.
function passwordMatcher(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-register-professional',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register-professional.html',
  styleUrls: ['./register-professional.css']
})
export class RegisterProfessionalComponent {
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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [''], // Optional
      username: ['', [Validators.required, Validators.email]], // Email
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatcher });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // We send the userType along with the other data
    const requestPayload = {
      ...this.registerForm.value,
      userType: 'PROFESSIONAL' // Specify the user type for the backend
    };

    // Assuming a single registration endpoint as discussed
    this.http.post('http://localhost:8080/api/auth/register', requestPayload, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = "Professional account created successfully! Redirecting to login...";
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.error && typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'An unknown error occurred. Please try again.';
          }
          console.error('Registration failed:', err);
        }
      });
  }
}
