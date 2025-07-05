import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // RouterModule برای routerLink لازم است
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // RouterModule را اضافه کنید
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  // سرویس Router را برای هدایت کاربر تزریق می‌کنیم
  constructor(private router: Router) { }

  /**
   * این متد کاربر را با پاک کردن توکن و هدایت به صفحه لاگین، از سیستم خارج می‌کند.
   */
  logout(): void {
    // ۱. توکن JWT را از حافظه محلی پاک می‌کنیم
    localStorage.removeItem('jwtToken');
    console.log('User logged out, token removed.');

    // ۲. کاربر را به صفحه لاگین هدایت می‌کنیم
    this.router.navigate(['/login']);
  }
}
