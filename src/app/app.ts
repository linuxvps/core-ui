import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // RouterOutlet را وارد کنید
import { CommonModule } from '@angular/common'; // معمولا برای ngIf, ngFor و غیره نیاز است

@Component({
  selector: 'app-root', // این سلکتور در index.html استفاده می‌شود
  standalone: true,
  imports: [
    CommonModule, // اضافه کردن CommonModule
    RouterOutlet // RouterOutlet را در imports اضافه کنید
  ],
  templateUrl: './app.html', // مسیر به فایل HTML کامپوننت
  styleUrls: ['./app.css'] // مسیر به فایل CSS کامپوننت
})
export class AppComponent {
  title = 'Your Angular App'; // می‌توانید نام برنامه خود را اینجا قرار دهید
}
