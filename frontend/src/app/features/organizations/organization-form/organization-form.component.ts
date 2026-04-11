import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Organization } from '../../../models/organization.model';
import { OrganizationService } from '../../../services/organization.service';

@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="form-page">
      <div class="form-card">
        <div class="form-card-header">
          <div>
            <p class="eyebrow">Organizations</p>
            <h1>{{ isEdit ? 'Edit organization' : 'New organization' }}</h1>
            <p class="subtitle">
              Keep addresses and industries organized so contacts can be linked
              consistently.
            </p>
          </div>
          <a routerLink="/organizations" class="back-link"
            >Back to organizations</a
          >
        </div>

        <form [formGroup]="organizationForm" (ngSubmit)="onSubmit()">
          <div class="grid">
            <label>
              Organization name
              <input formControlName="name" placeholder="Acme Corporation" />
              <small
                *ngIf="
                  organizationForm.get('name')?.invalid &&
                  organizationForm.get('name')?.touched
                "
              >
                Organization name is required
              </small>
            </label>

            <label>
              Industry
              <input formControlName="industry" placeholder="Technology" />
            </label>
          </div>

          <label>
            Address
            <textarea
              formControlName="address"
              rows="4"
              placeholder="Street, city, state, postal code"
            ></textarea>
          </label>

          <div class="form-actions">
            <button type="submit" [disabled]="organizationForm.invalid || isSaving">
              {{ isSaving ? 'Saving...' : isEdit ? 'Update organization' : 'Create organization' }}
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
        min-height: 100vh;
        background: #f8fafc;
      }

      .form-page {
        max-width: 880px;
        margin: 0 auto;
      }

      .form-card {
        background: white;
        border-radius: 1.5rem;
        padding: 2rem;
        box-shadow: 0 20px 60px rgba(15, 23, 42, 0.05);
      }

      .form-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .eyebrow {
        margin: 0;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.8rem;
      }

      h1 {
        margin: 0.35rem 0 0.5rem;
      }

      .subtitle {
        margin: 0;
        color: #64748b;
        max-width: 32rem;
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
      }

      input,
      textarea {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 0.95rem;
        padding: 0.9rem 1rem;
        background: #f8fafc;
        font-size: 0.96rem;
        outline: none;
      }

      textarea {
        resize: vertical;
      }

      small,
      .form-error {
        color: #dc2626;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
      }

      button {
        border: none;
        background: #0f172a;
        color: white;
        padding: 0.95rem 1.5rem;
        border-radius: 999px;
        font-weight: 600;
        cursor: pointer;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      @media (max-width: 720px) {
        .form-card-header {
          flex-direction: column;
        }

        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class OrganizationFormComponent implements OnInit {
  organizationForm: FormGroup;
  organizationId?: string;
  isEdit = false;
  isSaving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.organizationForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      industry: [''],
    });
  }

  ngOnInit(): void {
    this.organizationId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = Boolean(this.organizationId);

    if (!this.organizationId) {
      return;
    }

    this.organizationService.getOrganizationById(this.organizationId).subscribe({
      next: (response) => {
        if (response.data) {
          this.organizationForm.patchValue(response.data);
        }
      },
      error: () => {
        this.errorMessage = 'Unable to load organization details.';
      },
    });
  }

  onSubmit(): void {
    if (this.organizationForm.invalid) {
      this.organizationForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    const payload = this.organizationForm.value as Organization;

    const request$ = this.isEdit
      ? this.organizationService.updateOrganization(this.organizationId!, payload)
      : this.organizationService.createOrganization(payload);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/organizations']);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.error || 'Unable to save organization.';
        this.isSaving = false;
      },
    });
  }
}
