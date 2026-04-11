import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactService } from '../../../services/contact.service';
import { Contact } from '../../../models/contact.model';
import { Organization } from '../../../models/organization.model';
import { OrganizationService } from '../../../services/organization.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="form-page">
      <div class="form-card">
        <div class="form-card-header">
          <div>
            <p class="eyebrow">Contacts</p>
            <h1>{{ isEdit ? 'Edit contact' : 'New contact' }}</h1>
          </div>
          <a routerLink="/contacts" class="back-link">Back to contacts</a>
        </div>

        <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
          <div class="grid">
            <label>
              First name
              <input formControlName="firstName" placeholder="First name" />
              <small
                *ngIf="
                  contactForm.get('firstName')?.invalid &&
                  contactForm.get('firstName')?.touched
                "
                >Required</small
              >
            </label>

            <label>
              Last name
              <input formControlName="lastName" placeholder="Last name" />
              <small
                *ngIf="
                  contactForm.get('lastName')?.invalid &&
                  contactForm.get('lastName')?.touched
                "
                >Required</small
              >
            </label>

            <label>
              Email
              <input formControlName="email" placeholder="Email address" />
              <small
                *ngIf="
                  contactForm.get('email')?.invalid &&
                  contactForm.get('email')?.touched
                "
                >Valid email required</small
              >
            </label>

            <label>
              Phone
              <input formControlName="phone" placeholder="Phone number" />
            </label>

            <label>
              Organization
              <select formControlName="organizationId">
                <option value="">No organization</option>
                <option
                  *ngFor="let organization of organizations"
                  [value]="organization._id"
                >
                  {{ organization.name }}
                </option>
              </select>
            </label>

            <label>
              Company
              <input formControlName="company" placeholder="Company" />
            </label>

            <label>
              Position
              <input formControlName="position" placeholder="Position" />
            </label>

            <label>
              Status
              <select formControlName="status">
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>

          <label class="full-width">
            Notes
            <textarea
              formControlName="notes"
              rows="4"
              placeholder="Additional notes"
            ></textarea>
          </label>

          <div class="form-actions">
            <button type="submit" [disabled]="contactForm.invalid">
              {{ isEdit ? 'Update contact' : 'Create contact' }}
            </button>
          </div>
        </form>

        <div class="form-error" *ngIf="errorMessage">{{ errorMessage }}</div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 1.5rem;
        background: #f8fafc;
        min-height: 100vh;
      }

      .form-page {
        max-width: 920px;
        margin: 0 auto;
      }

      .form-card {
        background: white;
        border-radius: 1.5rem;
        box-shadow: 0 20px 60px rgba(15, 23, 42, 0.05);
        padding: 2rem;
      }

      .form-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .eyebrow {
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: #475569;
        font-size: 0.8rem;
      }

      h1 {
        margin: 0.35rem 0 0;
      }

      .back-link {
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;
      }

      form {
        display: grid;
        gap: 1.25rem;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      label {
        display: grid;
        gap: 0.6rem;
        color: #334155;
        font-size: 0.95rem;
      }

      input,
      select,
      textarea {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 0.95rem;
        padding: 0.85rem 1rem;
        background: #f8fafc;
        font-size: 0.96rem;
        outline: none;
      }

      textarea {
        resize: vertical;
      }

      small {
        color: #ef4444;
      }

      .full-width {
        grid-column: 1 / -1;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
      }

      button[type='submit'] {
        border: none;
        background: #0f172a;
        color: white;
        padding: 0.95rem 1.5rem;
        border-radius: 999px;
        font-weight: 600;
        cursor: pointer;
      }

      button[type='submit']:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .form-error {
        color: #ef4444;
        padding-top: 0.5rem;
      }

      @media (max-width: 700px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup;
  organizations: Organization[] = [];
  isEdit = false;
  contactId?: string;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private organizationService: OrganizationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      organizationId: [''],
      company: [''],
      position: [''],
      status: ['lead'],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.loadOrganizations();
    this.contactId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = Boolean(this.contactId);

    if (this.contactId) {
      this.contactService.getContactById(this.contactId).subscribe({
        next: (response) => {
          if (response.data) {
            this.contactForm.patchValue(response.data);
          }
        },
        error: () => {
          this.errorMessage = 'Unable to load contact details.';
        },
      });
    }
  }

  loadOrganizations(): void {
    this.organizationService.getAllOrganizations().subscribe({
      next: (response) => {
        this.organizations = response.data || [];
      },
      error: () => {
        this.organizations = [];
      },
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...(this.contactForm.value as Contact),
      organizationId: this.contactForm.value.organizationId || '',
    } as Contact;

    const request$ = this.isEdit
      ? this.contactService.updateContact(this.contactId!, payload)
      : this.contactService.createContact(payload);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/contacts']);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to save contact.';
      },
    });
  }
}
