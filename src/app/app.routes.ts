// 📁 src/app/app.routes.ts
import { Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component'; // دیگر نیازی به ایمپورت در اینجا نیست اگر ریشه باشد

export const routes: Routes = [
  // { path: 'login', component: LoginComponent }, // حذف شود، چون LoginComponent ریشه است
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // مسیر پیش‌فرض پس از لاگین
  { path: '**', redirectTo: '/dashboard' } // هدایت مسیرهای ناموجود به داشبورد
];
