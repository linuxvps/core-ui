import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms'; // اگر از فرم‌های reactive استفاده می‌کنید

// نام کامپوننت و فایل طبق استاندارد انگولار اصلاح شد
import { LoginComponent } from './login.component';

describe('LoginComponent', () => { // نام تست به استاندارد تغییر کرد
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,      // وارد کردن خود کامپوننت (چون standalone است)
        ReactiveFormsModule, // برای پشتیبانی از FormBuilder و فرم‌های reactive
        RouterTestingModule  // یک نسخه شبیه‌سازی شده از Router را فراهم می‌کند
      ],
      providers: [
        // فراهم کردن HttpClient و ابزارهای تست آن به روش مدرن
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // این متد چرخه شناسایی تغییرات را فعال می‌کند و ngOnInit را فراخوانی می‌کند
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // می‌توانید تست‌های دیگری برای منطق کامپوننت اضافه کنید
  // مثلا:
  // it('should have an invalid form when fields are empty', () => {
  //   expect(component.loginForm.valid).toBeFalsy();
  // });
});
