# Frontend Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing a fully functional CRM frontend using Angular with the provided Contact Service and API endpoints.

## Project Structure

```
src/
├── app/
│   ├── features/
│   │   └── contacts/
│   │       ├── contacts-list/
│   │       ├── contact-form/
│   │       ├── contact-detail/
│   │       └── contacts.routes.ts
│   ├── models/
│   │   └── contact.model.ts          ✓ Already created
│   ├── services/
│   │   └── contact.service.ts        ✓ Already created
│   ├── app.routes.ts                 ✓ Already created
│   └── app.config.ts                 ✓ Already updated
├── styles.scss                        ✓ Already created
└── main.ts
```

## Step-by-Step Implementation

### Phase 1: Setup (✓ Completed)

- ✓ Angular project created with routing enabled
- ✓ SCSS styling configured
- ✓ HttpClient module added
- ✓ Contact model defined
- ✓ Contact service created
- ✓ Routes configured
- ✓ Global styles defined

### Phase 2: Complete Contacts List Component

**File**: `src/app/features/contacts/contacts-list/contacts-list.component.ts`

```typescript
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Contact } from "../../../models/contact.model";
import { ContactService } from "../../../services/contact.service";

@Component({
  selector: "app-contacts-list",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./contacts-list.component.html",
  styleUrls: ["./contacts-list.component.scss"],
})
export class ContactsListComponent implements OnInit {
  contacts: Contact[] = [];
  loading = false;
  error: string | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.loading = true;
    this.error = null;

    this.contactService.getAllContacts().subscribe({
      next: (response) => {
        if (response.success) {
          this.contacts = response.data || [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading contacts:", error);
        this.error = "Failed to load contacts. Please try again.";
        this.loading = false;
      },
    });
  }

  deleteContact(id: string | undefined): void {
    if (!id) return;

    if (confirm("Are you sure you want to delete this contact?")) {
      this.contactService.deleteContact(id).subscribe({
        next: () => {
          this.contacts = this.contacts.filter((c) => c._id !== id);
        },
        error: (error) => {
          console.error("Error deleting contact:", error);
          alert("Failed to delete contact. Please try again.");
        },
      });
    }
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case "customer":
        return "status-customer";
      case "prospect":
        return "status-prospect";
      case "inactive":
        return "status-inactive";
      default:
        return "status-lead";
    }
  }
}
```

**Template**: `src/app/features/contacts/contacts-list/contacts-list.component.html`

```html
<div class="contacts-container">
  <div class="contacts-header">
    <div>
      <h1>Contacts</h1>
      <p class="text-muted">Manage your customer relationships</p>
    </div>
    <a routerLink="/contacts/new" class="btn btn-primary">+ New Contact</a>
  </div>

  <div class="content-area">
    <!-- Loading State -->
    <div *ngIf="loading" class="loading">
      <p>Loading contacts...</p>
    </div>

    <!-- Error State -->
    <div *ngIf="error && !loading" class="alert alert-error">
      {{ error }}
      <button (click)="loadContacts()" class="btn-link">Retry</button>
    </div>

    <!-- Empty State -->
    <div
      *ngIf="!loading && !error && contacts.length === 0"
      class="empty-state">
      <h2>No contacts found</h2>
      <p>Create your first contact to get started.</p>
      <a routerLink="/contacts/new" class="btn btn-primary">Create Contact</a>
    </div>

    <!-- Contacts Table -->
    <div *ngIf="!loading && contacts.length > 0" class="table-responsive">
      <table class="contacts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let contact of contacts">
            <td>
              <strong>{{ contact.firstName }} {{ contact.lastName }}</strong>
            </td>
            <td>{{ contact.email }}</td>
            <td>{{ contact.phone || '-' }}</td>
            <td>{{ contact.company || '-' }}</td>
            <td>
              <span
                [ngClass]="getStatusBadgeClass(contact.status)"
                class="status-badge">
                {{ contact.status || 'lead' }}
              </span>
            </td>
            <td class="actions">
              <a [routerLink]="['/contacts', contact._id]" class="btn-icon"
                >View</a
              >
              <a
                [routerLink]="['/contacts', contact._id, 'edit']"
                class="btn-icon"
                >Edit</a
              >
              <button
                (click)="deleteContact(contact._id)"
                class="btn-icon btn-danger">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
```

**Styles**: `src/app/features/contacts/contacts-list/contacts-list.component.scss`

```scss
.contacts-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.contacts-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;

  h1 {
    margin: 0;
    font-size: 2rem;
  }

  .text-muted {
    color: #666;
    margin: 0.5rem 0 0;
  }
}

.content-area {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.loading {
  padding: 3rem;
  text-align: center;
  color: #666;
}

.alert {
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;

  &.alert-error {
    background-color: #fee;
    border-left: 4px solid var(--danger-color);
    color: var(--danger-color);

    .btn-link {
      background: none;
      border: none;
      color: var(--danger-color);
      text-decoration: underline;
      cursor: pointer;
      margin-left: 1rem;
      font-weight: 600;
    }
  }
}

.empty-state {
  padding: 3rem;
  text-align: center;

  h2 {
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1.5rem;
    color: #666;
  }
}

.table-responsive {
  overflow-x: auto;
}

.contacts-table {
  width: 100%;
  border-collapse: collapse;

  th {
    background-color: #f9f9f9;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #e0e0e0;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
  }

  tbody tr:hover {
    background-color: #f5f5f5;
  }

  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: capitalize;

    &.status-customer {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    &.status-prospect {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    &.status-lead {
      background-color: #fff3e0;
      color: #e65100;
    }

    &.status-inactive {
      background-color: #f5f5f5;
      color: #666;
    }
  }

  .actions {
    display: flex;
    gap: 0.5rem;

    .btn-icon {
      padding: 0.25rem 0.75rem;
      font-size: 0.85rem;
      border: none;
      border-radius: 4px;
      background-color: var(--light-color);
      color: var(--primary-color);
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;

      &:hover {
        background-color: var(--primary-color);
        color: white;
      }

      &.btn-danger {
        color: var(--danger-color);

        &:hover {
          background-color: var(--danger-color);
          color: white;
        }
      }
    }
  }
}

.btn {
  &.btn-primary {
    background-color: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;

    &:hover {
      background-color: darken(var(--primary-color), 10%);
    }
  }
}

@media (max-width: 768px) {
  .contacts-header {
    flex-direction: column;

    h1 {
      font-size: 1.5rem;
    }
  }

  .contacts-table {
    font-size: 0.9rem;

    th,
    td {
      padding: 0.75rem 0.5rem;
    }

    .actions {
      flex-direction: column;
    }
  }
}
```

---

### Phase 3: Complete Contact Form Component

**File**: `src/app/features/contacts/contact-form/contact-form.component.ts`

```typescript
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ContactService } from "../../../services/contact.service";
import { Contact } from "../../../models/contact.model";

@Component({
  selector: "app-contact-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./contact-form.component.html",
  styleUrls: ["./contact-form.component.scss"],
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  loading = false;
  submitting = false;
  error: string | null = null;
  editingId: string | null = null;
  statusOptions = ["lead", "prospect", "customer", "inactive"];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.contactForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.editingId = id;
      this.loadContact(id);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
      company: [""],
      position: [""],
      status: ["lead"],
      notes: [""],
    });
  }

  loadContact(id: string): void {
    this.loading = true;
    this.contactService.getContactById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.contactForm.patchValue(response.data);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading contact:", error);
        this.error = "Failed to load contact";
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched(this.contactForm);
      return;
    }

    this.submitting = true;
    this.error = null;

    const formValue = this.contactForm.value;

    if (this.editingId) {
      this.contactService.updateContact(this.editingId, formValue).subscribe({
        next: () => {
          this.router.navigate(["/contacts", this.editingId]);
        },
        error: (error) => {
          console.error("Error updating contact:", error);
          this.error = "Failed to update contact. Please try again.";
          this.submitting = false;
        },
      });
    } else {
      this.contactService.createContact(formValue).subscribe({
        next: (response) => {
          if (response.data?._id) {
            this.router.navigate(["/contacts", response.data._id]);
          } else {
            this.router.navigate(["/contacts"]);
          }
        },
        error: (error) => {
          console.error("Error creating contact:", error);
          this.error = "Failed to create contact. Please try again.";
          this.submitting = false;
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(["/contacts"]);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string | null {
    const field = this.contactForm.get(fieldName);
    if (field?.hasError("required")) {
      return `${fieldName} is required`;
    }
    if (field?.hasError("minlength")) {
      return `${fieldName} must be at least 2 characters`;
    }
    if (field?.hasError("email")) {
      return "Invalid email address";
    }
    return null;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
```

**Template**: `src/app/features/contacts/contact-form/contact-form.component.html`

```html
<div class="form-container">
  <div class="form-header">
    <h1>{{ editingId ? 'Edit Contact' : 'Create New Contact' }}</h1>
  </div>

  <div class="content-area">
    <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
      <!-- Error Alert -->
      <div *ngIf="error" class="alert alert-error">{{ error }}</div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading">
        <p>Loading contact...</p>
      </div>

      <!-- Form Fields -->
      <div *ngIf="!loading" class="form-fields">
        <!-- First Name -->
        <div class="form-group">
          <label for="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            formControlName="firstName"
            [class.is-invalid]="isFieldInvalid('firstName')"
            placeholder="Enter first name" />
          <span *ngIf="isFieldInvalid('firstName')" class="field-error">
            {{ getFieldError('firstName') }}
          </span>
        </div>

        <!-- Last Name -->
        <div class="form-group">
          <label for="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            formControlName="lastName"
            [class.is-invalid]="isFieldInvalid('lastName')"
            placeholder="Enter last name" />
          <span *ngIf="isFieldInvalid('lastName')" class="field-error">
            {{ getFieldError('lastName') }}
          </span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email *</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            [class.is-invalid]="isFieldInvalid('email')"
            placeholder="Enter email address" />
          <span *ngIf="isFieldInvalid('email')" class="field-error">
            {{ getFieldError('email') }}
          </span>
        </div>

        <!-- Phone -->
        <div class="form-group">
          <label for="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            formControlName="phone"
            placeholder="Enter phone number" />
        </div>

        <!-- Company -->
        <div class="form-group">
          <label for="company">Company</label>
          <input
            type="text"
            id="company"
            formControlName="company"
            placeholder="Enter company name" />
        </div>

        <!-- Position -->
        <div class="form-group">
          <label for="position">Position</label>
          <input
            type="text"
            id="position"
            formControlName="position"
            placeholder="Enter job position" />
        </div>

        <!-- Status -->
        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" formControlName="status">
            <option *ngFor="let status of statusOptions" [value]="status">
              {{ status | titlecase }}
            </option>
          </select>
        </div>

        <!-- Notes -->
        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea
            id="notes"
            formControlName="notes"
            placeholder="Enter additional notes"
            rows="4"></textarea>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="contactForm.invalid || submitting">
            {{ submitting ? 'Saving...' : (editingId ? 'Update Contact' :
            'Create Contact') }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
```

**Styles**: `src/app/features/contacts/contact-form/contact-form.component.scss`

```scss
.form-container {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 2rem;

  h1 {
    font-size: 1.75rem;
  }
}

.content-area {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.alert {
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;

  &.alert-error {
    background-color: #fee;
    border-left: 4px solid var(--danger-color);
    color: var(--danger-color);
  }
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 600;
    color: #333;
  }

  input,
  select,
  textarea {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
    }

    &.is-invalid {
      border-color: var(--danger-color);
      background-color: #fff5f5;

      &:focus {
        box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
      }
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
}

.field-error {
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &.btn-primary {
    background-color: var(--primary-color);
    color: white;

    &:hover:not(:disabled) {
      background-color: darken(var(--primary-color), 10%);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &.btn-secondary {
    background-color: #e0e0e0;
    color: #333;

    &:hover {
      background-color: #d0d0d0;
    }
  }
}

@media (max-width: 768px) {
  .form-container {
    padding: 1rem;
  }

  .content-area {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
```

---

### Phase 4: Complete Contact Detail Component

**File**: `src/app/features/contacts/contact-detail/contact-detail.component.ts`

```typescript
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ContactService } from "../../../services/contact.service";
import { Contact } from "../../../models/contact.model";

@Component({
  selector: "app-contact-detail",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./contact-detail.component.html",
  styleUrls: ["./contact-detail.component.scss"],
})
export class ContactDetailComponent implements OnInit {
  contact: Contact | null = null;
  loading = false;
  error: string | null = null;
  contactId: string | null = null;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.contactId = this.route.snapshot.paramMap.get("id");
    if (this.contactId) {
      this.loadContact(this.contactId);
    }
  }

  loadContact(id: string): void {
    this.loading = true;
    this.error = null;

    this.contactService.getContactById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.contact = response.data;
        } else {
          this.error = "Contact not found";
        }
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading contact:", error);
        this.error = "Failed to load contact. Please try again.";
        this.loading = false;
      },
    });
  }

  deleteContact(): void {
    if (!this.contactId) return;

    if (
      confirm(
        "Are you sure you want to delete this contact? This action cannot be undone.",
      )
    ) {
      this.contactService.deleteContact(this.contactId).subscribe({
        next: () => {
          this.router.navigate(["/contacts"]);
        },
        error: (error) => {
          console.error("Error deleting contact:", error);
          alert("Failed to delete contact. Please try again.");
        },
      });
    }
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case "customer":
        return "status-customer";
      case "prospect":
        return "status-prospect";
      case "inactive":
        return "status-inactive";
      default:
        return "status-lead";
    }
  }

  goBack(): void {
    this.router.navigate(["/contacts"]);
  }
}
```

**Template**: `src/app/features/contacts/contact-detail/contact-detail.component.html`

```html
<div class="detail-container">
  <div class="detail-header">
    <button (click)="goBack()" class="btn-back">← Back to Contacts</button>
  </div>

  <!-- Loading State -->
  <div *ngIf="loading" class="loading">
    <p>Loading contact details...</p>
  </div>

  <!-- Error State -->
  <div *ngIf="error && !loading" class="alert alert-error">
    {{ error }}
    <button (click)="loadContact(contactId!)" class="btn-link">Retry</button>
  </div>

  <!-- Contact Details -->
  <div *ngIf="!loading && contact" class="contact-detail-card">
    <div class="detail-header-info">
      <div>
        <h1>{{ contact.firstName }} {{ contact.lastName }}</h1>
        <span
          [ngClass]="getStatusBadgeClass(contact.status)"
          class="status-badge">
          {{ contact.status || 'lead' }}
        </span>
      </div>
      <div class="header-actions">
        <a
          [routerLink]="['/contacts', contact._id, 'edit']"
          class="btn btn-primary"
          >Edit</a
        >
        <button (click)="deleteContact()" class="btn btn-danger">Delete</button>
      </div>
    </div>

    <div class="detail-info">
      <div class="info-section">
        <h3>Contact Information</h3>
        <div class="info-row">
          <label>Email:</label>
          <a [href]="'mailto:' + contact.email">{{ contact.email }}</a>
        </div>
        <div class="info-row" *ngIf="contact.phone">
          <label>Phone:</label>
          <a [href]="'tel:' + contact.phone">{{ contact.phone }}</a>
        </div>
      </div>

      <div class="info-section" *ngIf="contact.company || contact.position">
        <h3>Work Information</h3>
        <div class="info-row" *ngIf="contact.company">
          <label>Company:</label>
          <span>{{ contact.company }}</span>
        </div>
        <div class="info-row" *ngIf="contact.position">
          <label>Position:</label>
          <span>{{ contact.position }}</span>
        </div>
      </div>

      <div class="info-section" *ngIf="contact.notes">
        <h3>Notes</h3>
        <p class="notes-text">{{ contact.notes }}</p>
      </div>

      <div class="info-section">
        <h3>Metadata</h3>
        <div class="info-row" *ngIf="contact.createdAt">
          <label>Created:</label>
          <span>{{ contact.createdAt | date: 'medium' }}</span>
        </div>
        <div class="info-row" *ngIf="contact.updatedAt">
          <label>Last Updated:</label>
          <span>{{ contact.updatedAt | date: 'medium' }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Styles**: `src/app/features/contacts/contact-detail/contact-detail.component.scss`

```scss
.detail-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.detail-header {
  margin-bottom: 2rem;

  .btn-back {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 1rem;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      text-decoration: underline;
    }
  }
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.alert {
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;

  &.alert-error {
    background-color: #fee;
    border-left: 4px solid var(--danger-color);
    color: var(--danger-color);

    .btn-link {
      background: none;
      border: none;
      color: var(--danger-color);
      text-decoration: underline;
      cursor: pointer;
      margin-left: 1rem;
      font-weight: 600;
    }
  }
}

.contact-detail-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.detail-header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  border-bottom: 1px solid #e0e0e0;
  gap: 1rem;

  h1 {
    margin: 0 0 0.5rem;
  }

  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: capitalize;

    &.status-customer {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    &.status-prospect {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    &.status-lead {
      background-color: #fff3e0;
      color: #e65100;
    }

    &.status-inactive {
      background-color: #f5f5f5;
      color: #666;
    }
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
  }
}

.detail-info {
  padding: 2rem;
}

.info-section {
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    margin: 0 0 1rem;
    font-size: 1.1rem;
    color: #333;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 0.5rem;
  }
}

.info-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;

  label {
    font-weight: 600;
    min-width: 150px;
    color: #666;
  }

  span,
  a {
    flex: 1;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.notes-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
  color: #333;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &.btn-primary {
    background-color: var(--primary-color);
    color: white;

    &:hover {
      background-color: darken(var(--primary-color), 10%);
    }
  }

  &.btn-danger {
    background-color: #f5f5f5;
    color: var(--danger-color);
    border: 1px solid var(--danger-color);

    &:hover {
      background-color: var(--danger-color);
      color: white;
    }
  }
}

@media (max-width: 768px) {
  .detail-container {
    padding: 1rem;
  }

  .detail-header-info {
    flex-direction: column;
  }

  .info-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;

    .btn {
      width: 100%;
    }
  }
}
```

---

## How to Implement

1. **Copy-paste** each component's TypeScript code
2. **Create** the HTML and SCSS files in the respective component folders
3. **Replace** the placeholder content with the provided code
4. **Test** each component individually

## Testing the Implementation

### Start the Backend

```bash
cd backend
npm run dev
```

### Start MongoDB

```bash
mongod
# or if using Docker:
docker-compose up -d
```

### Start the Frontend

```bash
cd frontend/crm-frontend
npm start
```

### Test in Browser

1. Open `http://localhost:4200`
2. Click "New Contact" to create a contact
3. View the list of all contacts
4. Click on a contact to view details
5. Edit or delete contacts

## Next Steps

- Add search and filter functionality
- Implement pagination
- Add data export (CSV, PDF)
- Implement activity tracking
- Add user authentication
- Create dashboard with statistics
- Add email integration
- Implement data validation on the frontend
- Add loading animations
- Implement error boundaries

---

## Troubleshooting

**CORS Error?**

- Ensure backend is running on port 5000
- Check CORS_ORIGIN in backend/.env matches http://localhost:4200

**API calls not working?**

- Open browser DevTools → Network tab
- Check if requests are reaching the backend
- Verify MongoDB is connected

**Form validation not working?**

- Ensure ReactiveFormsModule is imported
- Check formControlName bindings match the FormGroup

**Routing not working?**

- Ensure routes are properly configured in contacts.routes.ts
- Check RouterModule is imported in components
