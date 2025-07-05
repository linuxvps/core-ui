import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }], // Username (email) should not be editable
      firstName: [''],
      lastName: [''],
      phoneNumber: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.http.get<any>('http://localhost:8080/api/users/me').subscribe({
      next: (data) => {
        this.profileForm.patchValue(data); // Populate the form with fetched data
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Failed to load profile data.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // The form value will not include disabled controls, which is fine.
    this.http.put('http://localhost:8080/api/profile/me', this.profileForm.value, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.successMessage = response;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Failed to update profile.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}

