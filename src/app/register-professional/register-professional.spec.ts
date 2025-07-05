import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProfessional } from './register-professional';

describe('RegisterProfessional', () => {
  let component: RegisterProfessional;
  let fixture: ComponentFixture<RegisterProfessional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterProfessional]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterProfessional);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
