import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Deal, DealContact, DealStage } from '../../../models/deal.model';
import { DealService } from '../../../services/deal.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="deal-form-page">
      <div class="deal-form-card">
        <div class="card-header">
          <div>
            <p class="eyebrow">Deals</p>
            <h1>{{ isEdit ? 'Edit deal' : 'Create deal' }}</h1>
            <p class="subtitle">
              Add the key details, assign ownership, and place this deal in the
              right stage from day one.
            </p>
          </div>
          <a routerLink="/deals" class="back-link">Back to pipeline</a>
        </div>

        <form [formGroup]="dealForm" (ngSubmit)="onSubmit()">
          <div class="grid">
            <label>
              Deal title
              <input formControlName="title" placeholder="Website redesign retainer" />
            </label>

            <label>
              Value
              <input formControlName="value" type="number" min="0" placeholder="5000" />
            </label>

            <label>
              Stage
              <select formControlName="stage">
                <option *ngFor="let stage of stages" [value]="stage">{{ stage }}</option>
              </select>
            </label>

            <label>
              Assigned to
              <input
                formControlName="assignedTo"
                list="assignee-options"
                placeholder="Account owner"
              />
              <datalist id="assignee-options">
                <option *ngFor="let assignee of assignees" [value]="assignee"></option>
              </datalist>
            </label>
          </div>

          <label>
            Linked contact
            <select formControlName="contactId">
              <option value="">Select a contact</option>
              <option *ngFor="let contact of contacts" [value]="contact._id">
                {{ getContactLabel(contact) }}
              </option>
            </select>
          </label>

          <div class="form-actions">
            <button type="submit" [disabled]="dealForm.invalid || isSaving">
              {{ isSaving ? 'Saving...' : isEdit ? 'Update deal' : 'Create deal' }}
            </button>
          </div>
        </form>

        <div class="error-state" *ngIf="errorMessage">{{ errorMessage }}</div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 1.5rem;
        min-height: 100vh;
        background:
          radial-gradient(circle at top right, rgba(14, 165, 233, 0.14), transparent 24%),
          #f8fafc;
      }

      .deal-form-page {
        max-width: 920px;
        margin: 0 auto;
      }

      .deal-form-card {
        padding: 2rem;
        border-radius: 1.75rem;
        background: white;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.06);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: flex-start;
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
        font-weight: 600;
        text-decoration: none;
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
      select {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 1rem;
        padding: 0.9rem 1rem;
        background: #f8fafc;
        outline: none;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
      }

      button {
        border: none;
        border-radius: 999px;
        padding: 0.95rem 1.45rem;
        background: #0f172a;
        color: white;
        font-weight: 600;
        cursor: pointer;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .error-state {
        margin-top: 1rem;
        color: #dc2626;
      }

      @media (max-width: 720px) {
        .card-header {
          flex-direction: column;
        }

        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DealFormComponent implements OnInit {
  readonly stages: DealStage[] = ['Lead', 'Contacted', 'Proposal', 'Won', 'Lost'];
  dealForm: FormGroup;
  contacts: DealContact[] = [];
  assignees: string[] = [];
  isEdit = false;
  isSaving = false;
  errorMessage = '';
  dealId?: string;

  constructor(
    private fb: FormBuilder,
    private dealService: DealService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const currentUser = this.authService.getCurrentUser();

    this.dealForm = this.fb.group({
      title: ['', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
      stage: ['Lead', Validators.required],
      contactId: ['', Validators.required],
      assignedTo: [currentUser?.name || currentUser?.email || '', Validators.required],
    });
  }

  ngOnInit(): void {
    this.dealId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = Boolean(this.dealId);
    this.loadMeta();

    if (!this.dealId) {
      return;
    }

    this.dealService.getDealById(this.dealId).subscribe({
      next: (response) => {
        if (response.data) {
          this.dealForm.patchValue(response.data);
        }
      },
      error: () => {
        this.errorMessage = 'Unable to load deal details.';
      },
    });
  }

  loadMeta(): void {
    this.dealService.getDealMeta().subscribe({
      next: (response) => {
        this.contacts = response.contacts || [];
        const currentAssignee = this.dealForm.get('assignedTo')?.value;
        this.assignees = Array.from(
          new Set([...(response.assignees || []), currentAssignee].filter(Boolean)),
        );
      },
      error: () => {
        this.contacts = [];
        this.assignees = [];
      },
    });
  }

  onSubmit(): void {
    if (this.dealForm.invalid) {
      this.dealForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const payload = this.dealForm.value as Deal;
    const request$ = this.isEdit
      ? this.dealService.updateDeal(this.dealId!, payload)
      : this.dealService.createDeal(payload);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/deals']);
      },
      error: (error) => {
        this.errorMessage = error?.error?.error || 'Unable to save the deal.';
        this.isSaving = false;
      },
    });
  }

  getContactLabel(contact: DealContact): string {
    const fullName = `${contact.firstName} ${contact.lastName}`.trim();
    return `${fullName} · ${contact.email}`;
  }
}
