import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Required for [(ngModel)]

// Interface to define the structure of professional data
export interface ProfessionalProfile {
  id: number;
  username: string; // Typically used for display or linking to user profile
  firstName: string;
  lastName: string;
  specialty: string;
  bio: string;
  profilePictureUrl?: string; // Optional
  // You can add other fields like consultationDurationMinutes, consultationPrice if needed
}

// Interface for the paginated API response structure
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current page number (zero-indexed)
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

@Component({
  selector: 'app-professionals-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './professionals-list.html',
  styleUrls: ['./professionals-list.css']
})
export class ProfessionalsListComponent implements OnInit {

  professionals: ProfessionalProfile[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  // Pagination state
  currentPage: number = 0; // Current page number (zero-indexed)
  pageSize: number = 10; // Items per page
  totalElements: number = 0; // Total available items
  totalPages: number = 0; // Total available pages

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadProfessionals();
  }

  /**
   * Loads the list of professionals based on the current page and page size.
   */
  loadProfessionals(): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Construct the API URL with pagination parameters
    const url = `http://localhost:8080/api/professionals?page=${this.currentPage}&size=${this.pageSize}`;

    this.http.get<PageResponse<ProfessionalProfile>>(url)
      .subscribe({
        next: (response) => {
          this.professionals = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.currentPage = response.number; // Sync current page number from response
          this.pageSize = response.size;     // Sync page size from response

          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = 'Failed to load professionals. Please try again later.';
          this.isLoading = false;
          console.error('Error fetching professionals:', err);
        }
      });
  }

  /**
   * Navigates to the next page.
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProfessionals();
    }
  }

  /**
   * Navigates to the previous page.
   */
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProfessionals();
    }
  }

  /**
   * Navigates to a specific page.
   * @param pageNumber The zero-indexed page number to navigate to.
   */
  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber < this.totalPages) {
      this.currentPage = pageNumber;
      this.loadProfessionals();
    }
  }

  /**
   * Handles changes to the items per page (page size) selector.
   * Resets to the first page when page size changes.
   */
  onPageSizeChange(): void {
    this.currentPage = 0; // Reset to the first page when page size changes
    this.loadProfessionals();
  }

  /**
   * Generates an array of page numbers for display in pagination controls.
   * For example, if totalPages = 5, returns [0, 1, 2, 3, 4].
   */
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
