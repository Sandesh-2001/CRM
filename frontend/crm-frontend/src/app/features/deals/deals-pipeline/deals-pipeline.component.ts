import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiResponse } from '../../../models/contact.model';
import { Deal, DealStage } from '../../../models/deal.model';
import { DealService } from '../../../services/deal.service';

type PipelineColumn = {
  id: DealStage;
  title: DealStage;
  accentClass: string;
  deals: Deal[];
};

@Component({
  selector: 'app-deals-pipeline',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CdkDropList,
    CdkDrag,
    CurrencyPipe,
  ],
  template: `
    <section class="pipeline-page">
      <header class="pipeline-header">
        <div>
          <p class="eyebrow">Deals</p>
          <h1>Revenue pipeline</h1>
          <p class="subtitle">
            Move opportunities across the funnel and keep momentum visible for
            the whole team.
          </p>
        </div>

        <div class="actions-row">
          <label class="search-field">
            <input
              type="search"
              placeholder="Search deals, contacts, or assignees"
              [(ngModel)]="search"
              (keyup.enter)="loadDeals()"
            />
            <button type="button" (click)="loadDeals()">Search</button>
          </label>

          <label class="filter-select">
            Stage
            <select [(ngModel)]="selectedStage" (change)="loadDeals()">
              <option value="">All stages</option>
              <option value="Lead">Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Proposal">Proposal</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </label>

          <label class="filter-select">
            Assignee
            <select [(ngModel)]="selectedAssignee" (change)="loadDeals()">
              <option value="">All assignees</option>
              <option *ngFor="let assignee of assignees" [value]="assignee">
                {{ assignee }}
              </option>
            </select>
          </label>

          <label class="filter-select">
            Start Date
            <input type="date" [(ngModel)]="startDate" (change)="loadDeals()" />
          </label>

          <label class="filter-select">
            End Date
            <input type="date" [(ngModel)]="endDate" (change)="loadDeals()" />
          </label>

          <button type="button" class="clear-filters" (click)="resetFilters()">
            Clear filters
          </button>
          <a routerLink="/deals/new" class="btn-primary">+ New Deal</a>
        </div>
      </header>

      <div class="summary-grid">
        <article class="summary-card">
          <span>Total deals</span>
          <strong>{{ totalDeals }}</strong>
        </article>
        <article class="summary-card accent-blue">
          <span>Pipeline value</span>
          <strong>{{
            totalValue | currency: 'USD' : 'symbol' : '1.0-0'
          }}</strong>
        </article>
        <article class="summary-card accent-green">
          <span>Won deals</span>
          <strong>{{ stageCounts['Won'] || 0 }}</strong>
        </article>
        <article class="summary-card accent-rose">
          <span>Lost deals</span>
          <strong>{{ stageCounts['Lost'] || 0 }}</strong>
        </article>
      </div>

      <section class="board-shell" *ngIf="!isLoading; else loading">
        <div class="board-scroll">
          <div class="board-grid">
            <section
              *ngFor="let column of columns"
              class="board-column"
              [ngClass]="column.accentClass"
            >
              <div class="column-header">
                <div>
                  <h2>{{ column.title }}</h2>
                  <p>{{ column.deals.length }} deals</p>
                </div>
                <span class="column-value">{{
                  getColumnValue(column.id)
                    | currency: 'USD' : 'symbol' : '1.0-0'
                }}</span>
              </div>

              <div
                class="deal-list"
                cdkDropList
                [id]="column.id"
                [cdkDropListData]="column.deals"
                [cdkDropListConnectedTo]="connectedDropLists"
                (cdkDropListDropped)="drop($event)"
              >
                <article
                  class="deal-card"
                  *ngFor="let deal of column.deals"
                  cdkDrag
                >
                  <div class="card-top">
                    <span class="deal-badge">{{ deal.stage }}</span>
                    <div class="card-actions">
                      <a [routerLink]="['/deals', deal._id, 'edit']">Edit</a>
                      <button type="button" (click)="deleteDeal(deal)">
                        Delete
                      </button>
                    </div>
                  </div>

                  <h3>{{ deal.title }}</h3>
                  <p class="contact-name">
                    {{ getContactName(deal) }}
                  </p>

                  <div class="deal-meta">
                    <div class="meta-block">
                      <span class="meta-label">Value</span>
                      <strong>{{
                        deal.value | currency: 'USD' : 'symbol' : '1.0-0'
                      }}</strong>
                    </div>
                    <div class="meta-block meta-block-right">
                      <span class="meta-label">Owner</span>
                      <strong>{{ deal.assignedTo }}</strong>
                    </div>
                  </div>

                  <div class="deal-submeta">
                    <span>{{ deal.contact?.email || 'No email' }}</span>
                    <span>{{ deal.contact?.company || 'No company' }}</span>
                  </div>
                </article>

                <div class="empty-column" *ngIf="!column.deals.length">
                  Drop deals here
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <ng-template #loading>
        <div class="loading-state">Loading pipeline…</div>
      </ng-template>

      <div class="error-state" *ngIf="errorMessage">{{ errorMessage }}</div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 1.5rem;
        min-height: 100vh;
        background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
      }

      .pipeline-page {
        max-width: 100%;
        margin: 0 auto;
        display: grid;
        gap: 1.5rem;
      }

      .pipeline-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 1rem;
      }

      .eyebrow {
        margin: 0;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        font-size: 0.78rem;
      }

      h1 {
        margin: 0.4rem 0 0.5rem;
        color: #0f172a;
        font-size: 2.2rem;
      }

      .subtitle {
        margin: 0;
        max-width: 36rem;
        color: #64748b;
      }

      .actions-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
        justify-content: flex-end;
        max-width: 100%;
      }

      .search-field {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1 1 320px;
        min-width: 0;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 999px;
        padding: 0.35rem 0.75rem;
      }

      .search-field input {
        min-width: 0;
        flex: 1 1 auto;
        border: none;
        outline: none;
        background: transparent;
        padding: 0.7rem 0.5rem;
      }

      .search-field button,
      .btn-primary {
        border: none;
        border-radius: 999px;
        padding: 0.85rem 1.2rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
      }

      .search-field button {
        color: white;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      }

      .btn-primary {
        color: white;
        background: #0f172a;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1rem;
      }

      .summary-card {
        padding: 1.3rem 1.4rem;
        border-radius: 1.4rem;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(148, 163, 184, 0.22);
      }

      .summary-card strong {
        display: block;
        margin-top: 0.8rem;
        font-size: 2rem;
      }

      .accent-blue {
        background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
      }

      .accent-green {
        background: linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%);
      }

      .accent-rose {
        background: linear-gradient(135deg, #ffe4e6 0%, #fff1f2 100%);
      }

      .board-shell {
        border-radius: 1.75rem;
        background: rgba(255, 255, 255, 0.66);
        border: 1px solid rgba(148, 163, 184, 0.18);
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.07);
      }

      .board-scroll {
        padding: 1rem;
      }

      .board-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 1rem;
        min-width: 0;
      }

      .board-column {
        display: grid;
        gap: 0.9rem;
        padding: 1rem;
        border-radius: 1.5rem;
        min-height: 440px;
        min-width: 0;
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(226, 232, 240, 0.95);
      }

      .board-column.lead {
        background: linear-gradient(
          180deg,
          rgba(219, 234, 254, 0.85),
          rgba(255, 255, 255, 0.94)
        );
      }

      .board-column.contacted {
        background: linear-gradient(
          180deg,
          rgba(224, 242, 254, 0.85),
          rgba(255, 255, 255, 0.94)
        );
      }

      .board-column.proposal {
        background: linear-gradient(
          180deg,
          rgba(254, 249, 195, 0.88),
          rgba(255, 255, 255, 0.94)
        );
      }

      .board-column.won {
        background: linear-gradient(
          180deg,
          rgba(220, 252, 231, 0.88),
          rgba(255, 255, 255, 0.94)
        );
      }

      .board-column.lost {
        background: linear-gradient(
          180deg,
          rgba(254, 226, 226, 0.88),
          rgba(255, 255, 255, 0.94)
        );
      }

      .column-header {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        align-items: flex-start;
      }

      .column-header h2 {
        margin: 0;
        font-size: 1.05rem;
        color: #0f172a;
      }

      .column-header p {
        margin: 0.35rem 0 0;
        color: #64748b;
      }

      .column-value {
        font-size: 0.85rem;
        color: #0f172a;
        background: rgba(255, 255, 255, 0.78);
        border-radius: 999px;
        padding: 0.55rem 0.75rem;
      }

      .deal-list {
        display: grid;
        gap: 0.85rem;
        align-content: start;
        min-height: 100%;
      }

      .deal-card {
        display: grid;
        gap: 0.95rem;
        padding: 1rem;
        border-radius: 1.25rem;
        min-width: 0;
        background: white;
        border: 1px solid rgba(226, 232, 240, 0.95);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
        cursor: grab;
      }

      .card-top {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        align-items: center;
        flex-wrap: wrap;
      }

      .deal-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.45rem 0.7rem;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 700;
        color: #1e3a8a;
        background: #dbeafe;
      }

      .card-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        margin-left: auto;
      }

      .card-actions a,
      .card-actions button {
        border: none;
        background: none;
        color: #2563eb;
        cursor: pointer;
        font-size: 0.85rem;
        text-decoration: none;
        padding: 0;
        line-height: 1.2;
      }

      .card-actions button {
        color: #dc2626;
      }

      .deal-card h3 {
        margin: 0;
        font-size: 1.08rem;
        line-height: 1.35;
        color: #0f172a;
        overflow-wrap: anywhere;
      }

      .contact-name {
        margin: 0;
        color: #334155;
        font-weight: 600;
        font-size: 0.98rem;
        overflow-wrap: anywhere;
      }

      .deal-meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
        padding-top: 0.15rem;
        border-top: 1px solid #e2e8f0;
      }

      .meta-block {
        display: grid;
        gap: 0.2rem;
        min-width: 0;
      }

      .meta-block strong {
        color: #0f172a;
        font-size: 0.95rem;
        overflow-wrap: anywhere;
      }

      .meta-block-right {
        text-align: right;
      }

      .meta-label {
        color: #94a3b8;
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .deal-submeta {
        display: grid;
        gap: 0.35rem;
        color: #94a3b8;
        font-size: 0.84rem;
      }

      .deal-submeta span {
        overflow-wrap: anywhere;
      }

      .empty-column,
      .loading-state,
      .error-state {
        padding: 1.5rem;
        text-align: center;
        color: #64748b;
      }

      .empty-column {
        border: 1px dashed rgba(148, 163, 184, 0.65);
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.46);
      }

      .error-state {
        color: #dc2626;
      }

      @media (max-width: 1320px) {
        .pipeline-header {
          flex-direction: column;
          align-items: stretch;
        }

        .actions-row {
          justify-content: flex-start;
        }

        .board-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      @media (max-width: 1024px) {
        .summary-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .board-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 760px) {
        .search-field {
          width: 100%;
        }

        .summary-grid {
          grid-template-columns: 1fr;
        }

        .board-grid {
          grid-template-columns: 1fr;
        }

        .deal-meta {
          grid-template-columns: 1fr;
        }

        .meta-block-right {
          text-align: left;
        }
      }
    `,
  ],
})
export class DealsPipelineComponent implements OnInit {
  readonly stages: DealStage[] = [
    'Lead',
    'Contacted',
    'Proposal',
    'Won',
    'Lost',
  ];
  columns: PipelineColumn[] = [
    { id: 'Lead', title: 'Lead', accentClass: 'lead', deals: [] },
    {
      id: 'Contacted',
      title: 'Contacted',
      accentClass: 'contacted',
      deals: [],
    },
    { id: 'Proposal', title: 'Proposal', accentClass: 'proposal', deals: [] },
    { id: 'Won', title: 'Won', accentClass: 'won', deals: [] },
    { id: 'Lost', title: 'Lost', accentClass: 'lost', deals: [] },
  ];
  connectedDropLists = this.stages;
  search = '';
  selectedStage = '';
  selectedAssignee = '';
  startDate = '';
  endDate = '';
  assignees: string[] = [];
  stageCounts: Partial<Record<DealStage, number>> = {};
  totalValue = 0;
  totalDeals = 0;
  isLoading = false;
  errorMessage = '';

  constructor(private dealService: DealService) {}

  ngOnInit(): void {
    this.loadMetadata();
    this.loadDeals();
  }

  loadMetadata(): void {
    this.dealService.getDealMeta().subscribe({
      next: (response) => {
        this.assignees = response.assignees || [];
      },
      error: (error) => {
        console.error('Unable to load deal metadata:', error);
      },
    });
  }

  loadDeals(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dealService
      .getAllDeals({
        search: this.search,
        stage: this.selectedStage as DealStage,
        assignedTo: this.selectedAssignee,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe({
        next: (response: ApiResponse<Deal[]>) => {
          const deals = response.data || [];
          this.totalDeals = deals.length;
          this.totalValue = response.totalValue || 0;
          this.stageCounts = response.stageCounts || {};
          this.columns = this.columns.map((column) => ({
            ...column,
            deals: deals.filter((deal) => deal.stage === column.id),
          }));
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error?.error?.error || 'Unable to load deals.';
          this.isLoading = false;
        },
      });
  }

  drop(event: CdkDragDrop<Deal[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      return;
    }

    const previousDeals = [...event.previousContainer.data];
    const currentDeals = [...event.container.data];
    const movedDeal = event.previousContainer.data[event.previousIndex];

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    if (!movedDeal?._id) {
      return;
    }

    const nextStage = event.container.id as DealStage;
    const updatedDeal: Deal = { ...movedDeal, stage: nextStage };

    this.stageCounts[movedDeal.stage] = Math.max(
      (this.stageCounts[movedDeal.stage] || 1) - 1,
      0,
    );
    this.stageCounts[nextStage] = (this.stageCounts[nextStage] || 0) + 1;

    this.dealService.updateDeal(movedDeal._id, updatedDeal).subscribe({
      next: (response) => {
        const savedDeal = response.data || updatedDeal;
        event.container.data[event.currentIndex] = savedDeal;
      },
      error: (error) => {
        event.previousContainer.data.splice(
          0,
          event.previousContainer.data.length,
          ...previousDeals,
        );
        event.container.data.splice(
          0,
          event.container.data.length,
          ...currentDeals,
        );
        this.stageCounts[movedDeal.stage] =
          (this.stageCounts[movedDeal.stage] || 0) + 1;
        this.stageCounts[nextStage] = Math.max(
          (this.stageCounts[nextStage] || 1) - 1,
          0,
        );
        this.errorMessage =
          error?.error?.error || 'Unable to move the deal right now.';
      },
    });
  }

  deleteDeal(deal: Deal): void {
    if (!deal._id) {
      return;
    }

    if (!confirm(`Delete ${deal.title}?`)) {
      return;
    }

    this.dealService.deleteDeal(deal._id).subscribe({
      next: () => {
        this.columns = this.columns.map((column) =>
          column.id === deal.stage
            ? {
                ...column,
                deals: column.deals.filter((item) => item._id !== deal._id),
              }
            : column,
        );
        this.totalDeals = Math.max(this.totalDeals - 1, 0);
        this.totalValue = Math.max(this.totalValue - (deal.value || 0), 0);
        this.stageCounts[deal.stage] = Math.max(
          (this.stageCounts[deal.stage] || 1) - 1,
          0,
        );
      },
      error: (error) => {
        this.errorMessage = error?.error?.error || 'Unable to delete deal.';
      },
    });
  }

  getColumnValue(stage: DealStage): number {
    const column = this.columns.find((item) => item.id === stage);
    return column?.deals.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;
  }

  getContactName(deal: Deal): string {
    const firstName = deal.contact?.firstName || '';
    const lastName = deal.contact?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'Unlinked contact';
  }

  resetFilters(): void {
    this.search = '';
    this.selectedStage = '';
    this.selectedAssignee = '';
    this.startDate = '';
    this.endDate = '';
    this.loadDeals();
  }
}
