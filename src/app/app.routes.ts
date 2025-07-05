import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthCallbackComponent} from './auth-callback/auth-callback.component';
import {RegisterComponent} from './register/register';
import {ProfileComponent} from './profile/profile';
// وارد کردن صحیح کامپوننت ثبت‌نام
// فرض می‌کنیم یک گارد برای محافظت از مسیرها دارید
// import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  // مسیر جدید برای ثبت‌نام
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // می‌توانیم با استفاده از canActivate از این مسیر محافظت کنیم تا فقط کاربران لاگین کرده به آن دسترسی داشته باشند
    // canActivate: [authGuard]
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent
  },
  // مسیر پیش‌فرض: اگر کاربر آدرس خاصی وارد نکرد، او را به صفحه لاگین بفرست
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {path: 'profile', component: ProfileComponent /*, canActivate: [authGuard] */},

  // مسیر Wildcard: اگر کاربر مسیری را وارد کرد که وجود ندارد، او را به لاگین بفرست
  {
    path: '**',
    redirectTo: '/login'
  }
];

