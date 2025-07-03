import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component'; // ایمپورت کامپوننت داشبورد

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent }, // مسیر داشبورد
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // مسیر پیش‌فرض به لاگین هدایت شود
  { path: '**', redirectTo: '/login' } // هدایت مسیرهای ناموجود به لاگین
];
