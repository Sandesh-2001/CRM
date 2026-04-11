import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  Activity,
  ActivityEntityType,
  ActivityMetaItem,
  ActivityType,
} from '../../../models/activity.model';
import { ActivityService } from '../../../services/activity.service';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="form-page">
      <div class="form-card">
        <div class="card-header">
          <div>
            <p class="eyebrow">Activities</p>
            <h1>Add activity</h1>
            <p class="subtitle">
              Log a quick follow-up and connect it to the right contact or deal.
            </p>
          </div>
          <a routerLink="/activities" class="back-link">Back to activities</a>
        </div>

        <form [formGroup]="activityForm" (ngSubmit)="onSubmit()">
          <div class="grid">
            <label>
              Type
              <select formControlName="type">
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
                <option value="task">Task</option>
              </select>
            </label>

            <label>
              Date and time
              <input formControlName="date" type="datetime-local" />
            </label>

            <label>
              Link to
              <select formControlName="entityType">
                <option value="contact">Contact</option>
                <option value="deal">Deal</option>
              </select>
            </label>

            <label>
              Related record
              <select formControlName="entityId">
                <option value="">Select a record</option>
                <option *ngFor="let item of relatedOptions" [value]="item._id">
                  {{ item.label }}{{ item.sublabel ? ' - ' + item.sublabel : '' }}
                </option>
              </select>
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" [disabled]="activityForm.invalid || isSaving">
              {{ isSaving ? 'Saving...' : 'Create activity' }}
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
        background: #f8fafc;
      }

      .form-page {
        max-width: 860px;
        margin: 0 auto;
      }

      .form-card {
        background: white;
        border-radius: 1.5rem;
        padding: 2rem;
        box-shadow: 0 20px 60px rgba(15, 23, 42, 0.05);
      }

      .card-header {
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
        max-width: 30rem;
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
      select {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 0.95rem;
        padding: 0.9rem 1rem;
        background: #f8fafc;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
      }

      button {
        border: none;
        background: #0f172a;
        color: white;
        border-radius: 999px;
        padding: 0.95rem 1.4rem;
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
export class ActivityFormComponent implements OnInit {
  readonly typeOptions: ActivityType[] = ['call', 'meeting', 'task'];
  activityForm: FormGroup;
  contactOptions: ActivityMetaItem[] = [];
  dealOptions: ActivityMetaItem[] = [];
  relatedOptions: ActivityMetaItem[] = [];
  isSaving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private router: Router,
  ) {
    const nextHour = new Date();
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(nextHour.getHours() + 1);

    this.activityForm = this.fb.group({
      type: ['call', Validators.required],
      date: [this.formatForInput(nextHour), Validators.required],
      entityType: ['contact', Validators.required],
      entityId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.activityService.getActivityMeta().subscribe({
      next: (response) => {
        this.contactOptions = response.contacts || [];
        this.dealOptions = response.deals || [];
        this.syncRelatedOptions();
      },
      error: () => {
        this.errorMessage = 'Unable to load related records.';
      },
    });

    this.activityForm.get('entityType')?.valueChanges.subscribe(() => {
      this.activityForm.patchValue({ entityId: '' });
      this.syncRelatedOptions();
    });
  }

  syncRelatedOptions(): void {
    const entityType = this.activityForm.get('entityType')?.value as ActivityEntityType;
    this.relatedOptions =
      entityType === 'deal' ? this.dealOptions : this.contactOptions;
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const value = this.activityForm.value;
    const payload: Activity = {
      type: value.type,
      date: new Date(value.date).toISOString(),
      status: 'pending',
      relatedTo: {
        entityType: value.entityType,
        entityId: value.entityId,
      },
    };

    this.activityService.createActivity(payload).subscribe({
      next: () => {
        this.router.navigate(['/activities']);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.error || 'Unable to save activity.';
        this.isSaving = false;
      },
    });
  }

  private formatForInput(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
