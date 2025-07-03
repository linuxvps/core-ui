import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AuthCallbackComponent} from './auth-callback.component/auth-callback.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  // مسیر برای دریافت JWT پس از ورود با گوگل
  { path: 'auth/callback', component: AuthCallbackComponent },
  // ریدایرکت از مسیر روت به صفحه لاگین
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // هر مسیر نامشخص دیگر را به صفحه لاگین ریدایرکت کنید
  { path: '**', redirectTo: '/login' }
];
