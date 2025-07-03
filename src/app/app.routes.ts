import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
// کامپوننت‌های دیگر را در صورت نیاز وارد کنید
// import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  // مسیر برای نمایش کامپوننت لاگین
  {
    path: 'login',
    component: LoginComponent
  },

  // مسیر پیش‌فرض: اگر کاربر آدرس خاصی وارد نکرد، او را به صفحه لاگین بفرست
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  // مسیر برای داشبورد (بعد از لاگین) - می‌توانید از AuthGuard برای محافظت از آن استفاده کنید
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // مسیر Wildcard: اگر کاربر مسیری را وارد کرد که وجود ندارد، او را به لاگین بفرست
  {
    path: '**',
    redirectTo: '/login'
  }
];
