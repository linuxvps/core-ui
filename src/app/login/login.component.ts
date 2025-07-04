import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router, ActivatedRoute, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // For [(ngModel)]
    RouterModule
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
  ) {
  }

  ngOnInit(): void {
    // Check for query parameters in the URL for messages (from Spring Boot redirects)
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        if (params['error'] === 'oauth_failed') {
          this.errorMessage = 'Google login failed. Please try again.';
        } else {
          this.errorMessage = 'Incorrect username or password, or unauthorized access.';
        }
      } else if (params['logout']) {
        this.successMessage = 'You have been successfully logged out.';
      } else if (params['session_expired']) {
        this.errorMessage = 'Your session has expired, please log in again.';
      } else if (params['unauthorized']) {
        this.errorMessage = 'You are not authorized to access this page, please log in again.';
      }
    });
  }

  /**
   * Handles traditional username/password login.
   */

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    this.http.post<any>('http://localhost:8080/authenticate', {username: this.username, password: this.password})
      .subscribe({
        next: (response) => {
          localStorage.setItem('jwtToken', response.jwt);
          console.log('JWT Token stored:', response.jwt);
          this.successMessage = 'Login successful!';
          this.router.navigate(['/dashboard']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login failed:', error);
          // Read the error message from the response body
          // We check for `error.error.error` because the backend JSON is { "error": "message" }
          if (error.error && error.error.error) {
            this.errorMessage = error.error.error;
          } else {
            this.errorMessage = 'Login failed: An unknown error occurred.';
          }
        }
      });
  }

  /**
   * Initiates the Google OAuth2 login flow.
   */
  loginWithGoogle(): void {
    this.errorMessage = null;
    this.successMessage = null;
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }
}
