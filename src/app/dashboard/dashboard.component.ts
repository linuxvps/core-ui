import { Component, OnInit } from '@angular/core'; // OnInit اضافه شد
import { CommonModule } from '@angular/common'; // برای ngIf, ngFor (اگر نیاز باشد)
import { Router, RouterModule } from '@angular/router'; // Router و RouterModule برای مسیریابی و routerLink

@Component({
  selector: 'app-dashboard',
  standalone: true, // این یک کامپوننت مستقل است
  imports: [CommonModule, RouterModule], // CommonModule و RouterModule را اضافه کنید
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // می‌توانید استایل‌های مختص داشبورد را در اینجا قرار دهید
})
export class DashboardComponent implements OnInit { // OnInit را implements کنید
  constructor(private router: Router) { } // Router را تزریق کنید

  ngOnInit(): void {
    // منطق اولیه هنگام بارگذاری کامپوننت (اختیاری)
  }

  onLogout(): void {
    // حذف JWT Token از Local Storage
    localStorage.removeItem('jwtToken');
    console.log('JWT Token removed.');
    // هدایت به Spring Boot برای پردازش لاگ اوت (که در SecurityConfig تعریف شده است)
    // و سپس Spring Boot کاربر را به login.html?logout=true هدایت می‌کند
    fetch('http://localhost:8080/perform_logout', { method: 'POST' })
      .finally(() => {
        // در صورت موفقیت یا شکست درخواست logout به بک‌اند، به صفحه لاگین هدایت شوید
        this.router.navigate(['/login'], { queryParams: { logout: 'true' } });
      });
  }
}
