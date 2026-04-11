import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Activity, ActivityStatus, ActivityType } from '../../../models/activity.model';
import { ActivityService } from '../../../services/activity.service';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  template: `
    <section class="activities-page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Activities</p>
          <h1>Daily follow-ups</h1>
          <p class="subtitle">
            Keep calls, meetings, and tasks visible so nothing slips through the cracks.
          </p>
        </div>

        <div class="header-actions">
          <label class="filter-pill">
            <span>Type</span>
            <select [(ngModel)]="selectedType" (change)="loadActivities()">
              <option value="">All types</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
              <option value="task">Task</option>
            </select>
          </label>

          <label class="filter-pill">
            <span>Status</span>
            <select [(ngModel)]="selectedStatus" (change)="loadActivities()">
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <a routerLink="/activities/new" class="btn-primary">+ Add Activity</a>
        </div>
      </header>

      <div class="summary-grid">
        <article class="summary-card">
          <span>Total activities</span>
          <strong>{{ activities.length }}</strong>
        </article>
        <article class="summary-card accent-card">
          <span>Pending</span>
          <strong>{{ pendingCount }}</strong>
        </article>
      </div>

      <section class="list-card" *ngIf="activities.length; else emptyState">
        <article
          class="activity-row"
          *ngFor="let activity of activities"
          [class.completed]="activity.status === 'completed'"
        >
          <div class="row-main">
            <div class="row-top">
              <span class="type-chip" [class]="activity.type">{{ activity.type }}</span>
              <span class="status-chip" [class.done]="activity.status === 'completed'">
                {{ activity.status }}
              </span>
            </div>

            <h2>{{ getActivityTitle(activity) }}</h2>
            <p class="related-label">
              Linked to {{ activity.relatedEntity?.entityType || activity.relatedTo.entityType }}:
              {{ activity.relatedEntity?.label || 'Unknown record' }}
            </p>
          </div>

          <div class="row-side">
            <span class="date-pill">{{ activity.date | date: 'medium' }}</span>
            <div class="row-actions">
              <button
                type="button"
                class="complete-btn"
                *ngIf="activity.status !== 'completed'"
                (click)="markCompleted(activity)"
              >
                Mark completed
              </button>
              <button type="button" class="delete-btn" (click)="deleteActivity(activity)">
                Delete
              </button>
            </div>
          </div>
        </article>
      </section>

      <ng-template #emptyState>
        <div class="empty-state" *ngIf="!isLoading">No activities found.</div>
      </ng-template>

      <div class="loading-state" *ngIf="isLoading">Loading activities…</div>
      <div class="error-state" *ngIf="errorMessage">{{ errorMessage }}</div>
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

      .activities-page {
        max-width: 1080px;
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
      }

      .subtitle {
        margin: 0;
        color: #64748b;
        max-width: 34rem;
      }

      .header-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
        justify-content: flex-end;
      }

      .filter-pill {
        display: grid;
        gap: 0.35rem;
        padding: 0.8rem 1rem;
        border-radius: 1rem;
        background: white;
        border: 1px solid #dbe3ef;
        min-width: 150px;
      }

      .filter-pill span {
        color: #64748b;
        font-size: 0.8rem;
      }

      .filter-pill select {
        border: none;
        background: transparent;
        padding: 0;
      }

      .btn-primary {
        border-radius: 999px;
        padding: 0.95rem 1.25rem;
        background: #0f172a;
        color: white;
        text-decoration: none;
        font-weight: 600;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      .summary-card {
        padding: 1.25rem 1.4rem;
        border-radius: 1.35rem;
        background: white;
        border: 1px solid rgba(148, 163, 184, 0.18);
      }

      .summary-card strong {
        display: block;
        margin-top: 0.7rem;
        font-size: 2rem;
      }

      .accent-card {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      }

      .list-card {
        display: grid;
        gap: 1rem;
      }

      .activity-row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding: 1.25rem;
        border-radius: 1.35rem;
        background: white;
        border: 1px solid rgba(148, 163, 184, 0.16);
        box-shadow: 0 16px 35px rgba(15, 23, 42, 0.04);
      }

      .activity-row.completed {
        opacity: 0.86;
      }

      .row-main {
        display: grid;
        gap: 0.6rem;
      }

      .row-top {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
      }

      .type-chip,
      .status-chip,
      .date-pill {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        padding: 0.4rem 0.75rem;
        font-size: 0.82rem;
        font-weight: 600;
      }

      .type-chip {
        background: #e2e8f0;
        color: #1e293b;
        text-transform: capitalize;
      }

      .type-chip.call {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .type-chip.meeting {
        background: #dcfce7;
        color: #15803d;
      }

      .type-chip.task {
        background: #fef3c7;
        color: #b45309;
      }

      .status-chip {
        background: #fee2e2;
        color: #b91c1c;
        text-transform: capitalize;
      }

      .status-chip.done {
        background: #dcfce7;
        color: #166534;
      }

      h2 {
        margin: 0;
        font-size: 1.1rem;
      }

      .related-label {
        margin: 0;
        color: #64748b;
      }

      .row-side {
        display: grid;
        gap: 0.85rem;
        justify-items: end;
        min-width: 220px;
      }

      .date-pill {
        background: #f8fafc;
        color: #334155;
      }

      .row-actions {
        display: flex;
        gap: 0.65rem;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .complete-btn,
      .delete-btn {
        border: none;
        border-radius: 999px;
        padding: 0.8rem 1rem;
        font-weight: 600;
        cursor: pointer;
      }

      .complete-btn {
        background: #0f766e;
        color: white;
      }

      .delete-btn {
        background: #fee2e2;
        color: #b91c1c;
      }

      .empty-state,
      .loading-state,
      .error-state {
        padding: 1.5rem;
        text-align: center;
      }

      .error-state {
        color: #dc2626;
      }

      @media (max-width: 860px) {
        .page-header,
        .activity-row {
          flex-direction: column;
          align-items: stretch;
        }

        .header-actions {
          justify-content: flex-start;
        }

        .row-side {
          justify-items: start;
          min-width: 0;
        }

        .row-actions {
          justify-content: flex-start;
        }
      }

      @media (max-width: 620px) {
        .summary-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ActivitiesListComponent implements OnInit {
  activities: Activity[] = [];
  selectedStatus: ActivityStatus | '' = '';
  selectedType: ActivityType | '' = '';
  isLoading = false;
  errorMessage = '';

  constructor(private activityService: ActivityService) {}

  get pendingCount(): number {
    return this.activities.filter((activity) => activity.status === 'pending').length;
  }

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.activityService
      .getAllActivities({
        status: this.selectedStatus,
        type: this.selectedType,
      })
      .subscribe({
        next: (response) => {
          this.activities = response.data || [];
          this.isLoading = false;
        },
        error: (error) => {
          this.activities = [];
          this.errorMessage =
            error?.error?.error || 'Unable to load activities.';
          this.isLoading = false;
        },
      });
  }

  getActivityTitle(activity: Activity): string {
    const label =
      activity.type === 'call'
        ? 'Call'
        : activity.type === 'meeting'
          ? 'Meeting'
          : 'Task';

    return `${label} scheduled`;
  }

  markCompleted(activity: Activity): void {
    if (!activity._id) {
      return;
    }

    this.activityService.markCompleted(activity._id).subscribe({
      next: (response) => {
        const updated = response.data;
        if (!updated) {
          return;
        }

        this.activities = this.activities.map((item) =>
          item._id === activity._id ? updated : item,
        );
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.error || 'Unable to mark activity as completed.';
      },
    });
  }

  deleteActivity(activity: Activity): void {
    if (!activity._id) {
      return;
    }

    if (!confirm('Delete this activity?')) {
      return;
    }

    this.activityService.deleteActivity(activity._id).subscribe({
      next: () => {
        this.activities = this.activities.filter((item) => item._id !== activity._id);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.error || 'Unable to delete activity.';
      },
    });
  }
}
