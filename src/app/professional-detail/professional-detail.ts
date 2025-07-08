import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProfessionalProfile } from '../professionals-list/professionals-list'; // Reusing the interface

@Component({
  selector: 'app-professional-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professional-detail.html',
  styleUrls: ['./professional-detail.css']
})
export class ProfessionalDetailComponent implements OnInit {

  professionalId: number | null = null;
  professional: ProfessionalProfile | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  // New state variables for custom booking confirmation modal
  showBookingConfirmationModal: boolean = false;
  bookingMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to route parameters to get the professional ID
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.professionalId = +idParam; // Convert string to number
        this.loadProfessionalDetails(this.professionalId);
      } else {
        this.errorMessage = 'Professional ID not provided in the URL.';
        this.isLoading = false;
        console.error(this.errorMessage);
        // Optionally redirect if ID is missing
        // this.router.navigate(['/professionals']);
      }
    });
  }

  /**
   * Loads the details of a specific professional by ID.
   * @param id The ID of the professional.
   */
  loadProfessionalDetails(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    // API call to fetch professional details
    // Assumes your backend has an endpoint like: /api/professionals/{id}
    this.http.get<ProfessionalProfile>(`http://localhost:8080/api/professionals/${id}`)
      .subscribe({
        next: (data) => {
          this.professional = data;
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.errorMessage = 'Professional not found.';
          } else {
            this.errorMessage = 'Failed to load professional details. Please try again later.';
          }
          this.isLoading = false;
          console.error('Error fetching professional details:', err);
        }
      });
  }

  /**
   * Navigates back to the professionals list page.
   */
  goBackToList(): void {
    this.router.navigate(['/professionals']);
  }

  /**
   * Handles booking consultation logic, now showing a custom modal.
   */
  bookConsultation(): void {
    if (this.professional) {
      this.bookingMessage = `Your consultation with ${this.professional.firstName} ${this.professional.lastName} has been successfully requested! We will contact you shortly.`;
      this.showBookingConfirmationModal = true;
    } else {
      this.bookingMessage = 'Could not book consultation. Professional details are missing.';
      this.showBookingConfirmationModal = true;
    }
  }

  /**
   * Closes the booking confirmation modal.
   */
  closeBookingConfirmationModal(): void {
    this.showBookingConfirmationModal = false;
    // Optionally, navigate away or reset state after closing the modal
    // this.router.navigate(['/professionals']);
  }
}
