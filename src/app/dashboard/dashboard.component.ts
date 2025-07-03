import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // برای استفاده از CommonModule
import { Router } from '@angular/router'; // برای هدایت به صفحه لاگ اوت

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private router: Router) {}

  /**
   * Handles user logout.
   * Clears the JWT token from localStorage and redirects to Spring Boot's logout endpoint.
   */
  logout(): void {
    localStorage.removeItem('jwtToken'); // پاک کردن توکن JWT از localStorage
    // ریدایرکت به اندپوینت logout در Spring Boot
    // Spring Boot سپس session را پاک کرده و به login.html?logout=true ریدایرکت می‌کند
    window.location.href = 'http://localhost:8080/perform_logout';
  }
}
