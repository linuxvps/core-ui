import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app'; // تصحیح شد: وارد کردن AppComponent
import { RouterTestingModule } from '@angular/router/testing'; // برای تست RouterOutlet

describe('AppComponent', () => { // تصحیح شد: نام تست
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent, // تصحیح شد: وارد کردن کامپوننت صحیح
        RouterTestingModule // RouterOutlet به این ماژول نیاز دارد
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); // تصحیح شد
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Your Angular App' title`, () => { // تست عنوان را دقیق‌تر می‌کنیم
    const fixture = TestBed.createComponent(AppComponent); // تصحیح شد
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Your Angular App');
  });

});
