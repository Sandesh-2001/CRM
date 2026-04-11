import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Organization } from '../../../models/organization.model';
import { OrganizationService } from '../../../services/organization.service';

@Component({
  selector: 'app-organizations-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="organizations-page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Organizations</p>
          <h1>Company network</h1>
          <p class="subtitle">
            Manage the companies your contacts belong to and keep your CRM data
            tidy.
          </p>
        </div>

        <div class="actions-row">
          <label class="search-field">
            <input
              type="search"
              placeholder="Search by name, address, or industry"
              [(ngModel)]="search"
              (keyup.enter)="loadOrganizations()"
            />
            <button type="button" (click)="loadOrganizations()">Search</button>
          </label>

          <label class="filter-select">
            Industry
            <select
              [(ngModel)]="selectedIndustry"
              (change)="loadOrganizations()"
            >
              <option value="">All industries</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Consulting">Consulting</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <button type="button" class="clear-filters" (click)="resetFilters()">
            Clear filters
          </button>
          <a routerLink="/organizations/new" class="btn-primary"
            >+ New Organization</a
          >
        </div>
      </header>

      <div class="stat-grid">
        <article class="stat-card">
          <span>Total organizations</span>
          <strong>{{ organizations.length }}</strong>
        </article>
        <article class="stat-card accent-card">
          <span>Linked contacts</span>
          <strong>{{ totalLinkedContacts }}</strong>
        </article>
      </div>

      <section class="organizations-card">
        <div class="table-wrap" *ngIf="organizations.length; else emptyState">
          <table class="organizations-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Industry</th>
                <th>Address</th>
                <th>Linked contacts</th>
                <th class="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let organization of organizations">
                <td>
                  <strong>{{ organization.name }}</strong>
                </td>
                <td>{{ organization.industry || 'Not set' }}</td>
                <td>{{ organization.address || 'Not set' }}</td>
                <td>{{ organization.contactCount || 0 }}</td>
                <td class="actions-column">
                  <a
                    [routerLink]="['/organizations', organization._id, 'edit']"
                    class="action-link"
                    >Edit</a
                  >
                  <button
                    type="button"
                    class="action-button danger"
                    (click)="deleteOrganization(organization)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #emptyState>
          <div class="empty-state" *ngIf="!isLoading">
            No organizations found yet.
          </div>
        </ng-template>

        <div class="loading-state" *ngIf="isLoading">
          Loading organizations…
        </div>
        <div class="error-state" *ngIf="errorMessage">{{ errorMessage }}</div>
      </section>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 1.5rem;
        min-height: 100vh;
        background: #f8fafc;
      }

      .organizations-page {
        max-width: 1180px;
        margin: 0 auto;
        display: grid;
        gap: 1.5rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 1rem;
      }

      .eyebrow {
        margin: 0;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.8rem;
      }

      h1 {
        margin: 0.35rem 0 0.5rem;
        font-size: 2rem;
        color: #0f172a;
      }

      .subtitle {
        margin: 0;
        color: #64748b;
        max-width: 36rem;
      }

      .actions-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
        justify-content: flex-end;
      }

      .search-field {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: white;
        border: 1px solid #cbd5e1;
        border-radius: 999px;
        padding: 0.35rem 0.75rem;
      }

      .search-field input {
        min-width: 240px;
        border: none;
        outline: none;
        background: transparent;
        padding: 0.65rem 0.5rem;
      }

      .search-field button,
      .btn-primary {
        border: none;
        border-radius: 999px;
        padding: 0.85rem 1.25rem;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
      }

      .search-field button {
        background: #2563eb;
        color: white;
      }

      .filter-select {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.875rem;
        color: #475569;
        font-weight: 500;
      }

      .filter-select select {
        padding: 0.5rem 0.75rem;
        border: 1px solid #cbd5e1;
        border-radius: 0.5rem;
        background: white;
        font-size: 0.875rem;
        color: #1f2937;
      }

      .clear-filters {
        border: 1px solid #cbd5e1;
        background: white;
        color: #475569;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
      }

      .clear-filters:hover {
        background: #f8fafc;
      }

      .btn-primary {
        background: #0f172a;
        color: white;
      }

      .stat-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      .stat-card {
        background: white;
        border-radius: 1.5rem;
        padding: 1.35rem 1.5rem;
        border: 1px solid rgba(148, 163, 184, 0.18);
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
      }

      .stat-card strong {
        display: block;
        margin-top: 0.75rem;
        font-size: 2rem;
        color: #0f172a;
      }

      .accent-card {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      }

      .organizations-card {
        background: white;
        border-radius: 1.5rem;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(15, 23, 42, 0.05);
      }

      .table-wrap {
        overflow-x: auto;
      }

      .organizations-table {
        width: 100%;
        min-width: 860px;
        border-collapse: collapse;
      }

      .organizations-table th,
      .organizations-table td {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #e2e8f0;
        text-align: left;
        color: #1f2937;
      }

      .organizations-table th {
        background: #f8fafc;
        color: #475569;
        font-weight: 600;
      }

      .actions-column {
        width: 180px;
      }

      .action-link,
      .action-button {
        border: none;
        background: none;
        color: #2563eb;
        cursor: pointer;
        text-decoration: none;
        margin-right: 0.75rem;
        font-size: 0.95rem;
      }

      .action-button.danger {
        color: #dc2626;
      }

      .loading-state,
      .empty-state,
      .error-state {
        padding: 1.5rem;
        text-align: center;
      }

      .error-state {
        color: #dc2626;
      }

      @media (max-width: 860px) {
        .page-header {
          flex-direction: column;
          align-items: stretch;
        }

        .actions-row {
          justify-content: flex-start;
        }

        .stat-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class OrganizationsListComponent implements OnInit {
  organizations: Organization[] = [];
  search = '';
  selectedIndustry = '';
  isLoading = false;
  errorMessage = '';

  constructor(private organizationService: OrganizationService) {}

  get totalLinkedContacts(): number {
    return this.organizations.reduce(
      (sum, organization) => sum + (organization.contactCount || 0),
      0,
    );
  }

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.organizationService
      .getAllOrganizations(this.search, this.selectedIndustry)
      .subscribe({
        next: (response) => {
          this.organizations = response.data || [];
          this.isLoading = false;
        },
        error: (error) => {
          this.organizations = [];
          this.errorMessage =
            error?.error?.error || 'Unable to load organizations.';
          this.isLoading = false;
        },
      });
  }

  resetFilters(): void {
    this.search = '';
    this.selectedIndustry = '';
    this.loadOrganizations();
  }

  deleteOrganization(organization: Organization): void {
    if (!organization._id) {
      return;
    }

    if (!confirm(`Delete ${organization.name}?`)) {
      return;
    }

    this.organizationService.deleteOrganization(organization._id).subscribe({
      next: () => {
        this.organizations = this.organizations.filter(
          (item) => item._id !== organization._id,
        );
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.error || 'Unable to delete organization.';
      },
    });
  }
}
