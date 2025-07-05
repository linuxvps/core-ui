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
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
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
    // Initialize the form with all the new fields and their validators.
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [''], // Optional field
      username: ['', [Validators.required, Validators.email]], // Username is the email
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatcher }); // Apply the custom password matcher
  }

  /**
   * Handles the registration form submission.
   */
  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Mark all fields as touched to display validation errors
      return;
    }

    this.isLoading = true;

    // The request payload now includes all the form fields
    // to match the backend's CreateUserRequest DTO.
    const requestPayload = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      phoneNumber: this.registerForm.value.phoneNumber,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };

    // The backend expects roles to be assigned by default, so we don't send them.
    this.http.post('http://localhost:8080/register', requestPayload, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = "Registration successful! You will be redirected to the login page.";
          // After a few seconds, redirect the user to the login page
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          // Display the error message from the backend
          if (err.error && typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'An unknown error occurred during registration. Please try again.';
          }
          console.error('Registration failed:', err);
        }
      });
  }
}
