import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // مطمئن شوید مسیر و نام کلاس درست است

bootstrapApplication(AppComponent, appConfig) // اینجا باید AppComponent باشد
  .catch((err) => console.error(err));
