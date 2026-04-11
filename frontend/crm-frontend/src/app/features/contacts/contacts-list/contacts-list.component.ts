import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Organization } from '../../../models/organization.model';
import { ContactService } from '../../../services/contact.service';
import { Contact } from '../../../models/contact.model';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fade-in">
      <!-- Header Actions -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
      >
        <div class="flex items-center gap-4">
          <label class="search-field">
            <input
              type="search"
              placeholder="Search by name, email, phone, or company"
              [(ngModel)]="search"
              (keyup.enter)="loadContacts(1)"
              class="form-input"
            />
            <button
              type="button"
              (click)="loadContacts(1)"
              class="btn btn-secondary"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </label>
        </div>
        <a routerLink="/contacts/new" class="btn btn-primary">+ New Contact</a>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="eyebrow">Total contacts</p>
                <p class="text-2xl font-bold text-gray-900">{{ total }}</p>
              </div>
              <div
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <span class="text-lg">👥</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="eyebrow">Leads</p>
                <p class="text-2xl font-bold text-yellow-600">
                  {{ statusCounts['lead'] || 0 }}
                </p>
              </div>
              <div
                class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
              >
                <span class="text-lg">🎯</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="eyebrow">Prospects</p>
                <p class="text-2xl font-bold text-blue-600">
                  {{ statusCounts['prospect'] || 0 }}
                </p>
              </div>
              <div
                class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <span class="text-lg">🔍</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="eyebrow">Customers</p>
                <p class="text-2xl font-bold text-green-600">
                  {{ statusCounts['customer'] || 0 }}
                </p>
              </div>
              <div
                class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <span class="text-lg">✅</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="card-body">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div class="form-group">
              <label class="form-label">Status</label>
              <select
                [(ngModel)]="selectedStatus"
                (change)="loadContacts(1)"
                class="form-select"
              >
                <option value="">All statuses</option>
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Organization</label>
              <select
                [(ngModel)]="selectedOrganization"
                (change)="loadContacts(1)"
                class="form-select"
              >
                <option value="">All organizations</option>
                <option
                  *ngFor="let org of organizationOptions"
                  [value]="org._id"
                >
                  {{ org.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input
                type="date"
                [(ngModel)]="startDate"
                (change)="loadContacts(1)"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">End Date</label>
              <input
                type="date"
                [(ngModel)]="endDate"
                (change)="loadContacts(1)"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">&nbsp;</label>
              <button
                type="button"
                class="btn btn-secondary w-full"
                (click)="resetFilters()"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contacts Table -->
      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Organization</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let contact of contacts" class="hover:bg-gray-50">
                <td class="font-medium">
                  {{ contact.firstName }} {{ contact.lastName }}
                </td>
                <td>{{ contact.email }}</td>
                <td>{{ contact.phone || '-' }}</td>
                <td>{{ contact.organization?.name || '-' }}</td>
                <td>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    [class]="getStatusBadgeClass(contact.status || 'lead')"
                  >
                    {{ contact.status || 'lead' | titlecase }}
                  </span>
                </td>
                <td class="text-right">
                  <div class="flex justify-end gap-2">
                    <a
                      [routerLink]="['/contacts', contact._id]"
                      class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </a>
                    <a
                      [routerLink]="['/contacts', contact._id, 'edit']"
                      class="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Edit
                    </a>
                    <button
                      type="button"
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                      (click)="deleteContact(contact._id!)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="card-footer" *ngIf="contacts.length && !isLoading">
          <div
            class="flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <span class="text-sm text-gray-600"
              >{{ total }} contacts found</span
            >
            <div class="flex items-center gap-2">
              <button
                type="button"
                [disabled]="page <= 1"
                (click)="loadContacts(page - 1)"
                class="btn btn-secondary"
                [class.opacity-50]="page <= 1"
              >
                Previous
              </button>
              <span class="text-sm text-gray-600 px-3"
                >Page {{ page }} of {{ pages || 1 }}</span
              >
              <button
                type="button"
                [disabled]="page >= pages"
                (click)="loadContacts(page + 1)"
                class="btn btn-secondary"
                [class.opacity-50]="page >= pages"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div class="loading-state" *ngIf="isLoading">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
          ></div>
          <p class="mt-2 text-gray-600">Loading contacts…</p>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!isLoading && !contacts.length">
          <div class="text-6xl mb-4">📋</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            No contacts found
          </h3>
          <p class="text-gray-600">Get started by adding your first contact.</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      // Search field styles
      .search-field {
        position: relative;
        max-width: 400px;
      }

      .search-field input {
        padding-right: 3rem;
      }

      .search-field button {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        padding: 0.5rem;
        border-radius: 0.375rem;
      }

      // Table responsive wrapper
      .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      // Status badge colors
      .bg-yellow-100 {
        background-color: #fef3c7;
      }
      .text-yellow-800 {
        color: #92400e;
      }
      .bg-blue-100 {
        background-color: #dbeafe;
      }
      .text-blue-800 {
        color: #1e40af;
      }
      .bg-green-100 {
        background-color: #dcfce7;
      }
      .text-green-800 {
        color: #166534;
      }
      .bg-gray-100 {
        background-color: #f3f4f6;
      }
      .text-gray-800 {
        color: #1f2937;
      }

      // Hover effects
      .hover\\:bg-gray-50:hover {
        background-color: #f9fafb;
      }

      // Text alignment
      .text-right {
        text-align: right;
      }

      // Font weights
      .font-medium {
        font-weight: 500;
      }

      // Spacing
      .gap-2 {
        gap: 0.5rem;
      }

      .gap-4 {
        gap: 1rem;
      }

      // Width utilities
      .w-full {
        width: 100%;
      }

      // Opacity utilities
      .opacity-50 {
        opacity: 0.5;
      }

      // Text sizes
      .text-xs {
        font-size: 0.75rem;
        line-height: 1rem;
      }

      .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      .text-lg {
        font-size: 1.125rem;
        line-height: 1.75rem;
      }

      .text-6xl {
        font-size: 3.75rem;
        line-height: 1;
      }

      // Text colors
      .text-gray-600 {
        color: #4b5563;
      }

      .text-gray-900 {
        color: #111827;
      }

      .text-blue-600 {
        color: #2563eb;
      }

      .text-blue-800 {
        color: #1e40af;
      }

      .text-gray-600 {
        color: #4b5563;
      }

      .text-gray-800 {
        color: #1f2937;
      }

      .text-red-600 {
        color: #dc2626;
      }

      .text-red-800 {
        color: #991b1b;
      }

      // Hover text colors
      .hover\\:text-blue-800:hover {
        color: #1e40af;
      }

      .hover\\:text-gray-800:hover {
        color: #1f2937;
      }

      .hover\\:text-red-800:hover {
        color: #991b1b;
      }

      // Margin utilities
      .mb-2 {
        margin-bottom: 0.5rem;
      }

      .mb-4 {
        margin-bottom: 1rem;
      }

      .mb-6 {
        margin-bottom: 1.5rem;
      }

      .mt-2 {
        margin-top: 0.5rem;
      }

      // Padding utilities
      .px-2 {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      }

      .py-1 {
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
      }

      .px-3 {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
      }

      // Border radius
      .rounded-full {
        border-radius: 9999px;
      }

      // Flex utilities
      .flex {
        display: flex;
      }

      .justify-end {
        justify-content: flex-end;
      }

      // Responsive design
      @media (max-width: 640px) {
        .search-field {
          max-width: 100%;
        }

        .table-responsive {
          font-size: 0.875rem;
        }

        .text-2xl {
          font-size: 1.25rem;
        }
      }
    `,
  ],
})
export class ContactsListComponent implements OnInit {
  contacts: Contact[] = [];
  search = '';
  selectedStatus = '';
  selectedOrganization = '';
  statusCounts: Record<string, number> = {};
  organizationOptions: Organization[] = [];
  page = 1;
  pages = 1;
  total = 0;
  isLoading = false;
  startDate = '';
  endDate = '';
  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(page = 1): void {
    this.page = page;
    this.isLoading = true;

    this.contactService
      .getAllContacts({
        page: this.page,
        limit: 10,
        search: this.search,
        status: this.selectedStatus,
        organization: this.selectedOrganization,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe({
        next: (response) => {
          this.contacts = response.data || [];
          this.total = response.total || 0;
          this.pages = response.pages || 1;
          this.statusCounts = response.statusCounts || {};
          this.organizationOptions = response.organizations || [];
          this.isLoading = false;
        },
        error: () => {
          this.contacts = [];
          this.total = 0;
          this.pages = 1;
          this.statusCounts = {};
          this.organizationOptions = [];
          this.isLoading = false;
        },
      });
  }

  resetFilters(): void {
    this.search = '';
    this.selectedStatus = '';
    this.selectedOrganization = '';
    this.startDate = '';
    this.endDate = '';
    this.loadContacts(1);
  }

  deleteContact(id: string): void {
    if (!confirm('Delete this contact?')) {
      return;
    }

    this.contactService.deleteContact(id).subscribe({
      next: () => this.loadContacts(this.page),
      error: () => alert('Unable to delete contact.'),
    });
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      lead: 'bg-yellow-100 text-yellow-800',
      prospect: 'bg-blue-100 text-blue-800',
      customer: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return (
      classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
    );
  }
}
