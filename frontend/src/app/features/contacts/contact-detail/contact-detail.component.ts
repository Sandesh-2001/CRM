import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContactService } from '../../../services/contact.service';
import { Contact } from '../../../models/contact.model';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="detail-page">
      <div class="detail-card">
        <div class="detail-header">
          <div>
            <p class="eyebrow">Contact detail</p>
            <h1>{{ contact?.firstName }} {{ contact?.lastName }}</h1>
          </div>
          <div class="header-actions">
            <a routerLink="/contacts" class="text-link">Back</a>
            <a
              [routerLink]="['/contacts', contact._id, 'edit']"
              class="btn-secondary"
              *ngIf="contact"
              >Edit</a
            >
          </div>
        </div>

        <div *ngIf="isLoading" class="loading-state">Loading contact…</div>
        <div *ngIf="errorMessage" class="error-state">{{ errorMessage }}</div>

        <div *ngIf="contact" class="detail-grid">
          <div class="detail-row">
            <span class="label">Email</span>
            <strong>{{ contact.email }}</strong>
          </div>
          <div class="detail-row">
            <span class="label">Phone</span>
            <strong>{{ contact.phone || '-' }}</strong>
          </div>
          <div class="detail-row">
            <span class="label">Organization</span>
            <strong>{{ contact.organization?.name || '-' }}</strong>
          </div>
          <div class="detail-row">
            <span class="label">Industry</span>
            <strong>{{ contact.organization?.industry || '-' }}</strong>
          </div>
          <div class="detail-row">
            <span class="label">Company</span>
            <strong>{{ contact.company || '-' }}</strong>
          </div>
          <div class="detail-row">
            <span class="label">Position</span>
            <strong>{{ contact.position || '-' }}</strong>
          </div>
          <div class="detail-row">
            <span class="label">Status</span>
            <strong>{{ contact.status || 'lead' }}</strong>
          </div>
          <div class="detail-row full-width">
            <span class="label">Notes</span>
            <p>{{ contact.notes || 'No notes added.' }}</p>
          </div>
        </div>
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

      .detail-page {
        max-width: 900px;
        margin: 0 auto;
      }

      .detail-card {
        background: white;
        border-radius: 1.5rem;
        padding: 2rem;
        box-shadow: 0 20px 60px rgba(15, 23, 42, 0.05);
      }

      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .eyebrow {
        margin: 0;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: #475569;
      }

      h1 {
        margin: 0.35rem 0 0;
      }

      .header-actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .text-link,
      .btn-secondary {
        padding: 0.75rem 1rem;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 600;
      }

      .text-link {
        color: #2563eb;
        background: #eff6ff;
      }

      .btn-secondary {
        color: white;
        background: #0f172a;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .detail-row {
        display: grid;
        gap: 0.35rem;
        padding: 1rem;
        border-radius: 1.25rem;
        background: #f8fafc;
      }

      .label {
        color: #475569;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }

      .full-width {
        grid-column: 1 / -1;
      }

      .loading-state,
      .error-state {
        padding: 1.5rem;
        text-align: center;
        color: #475569;
      }

      .error-state {
        color: #b91c1c;
      }

      @media (max-width: 700px) {
        .detail-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ContactDetailComponent implements OnInit {
  contact?: Contact;
  isLoading = true;
  errorMessage = '';

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Invalid contact ID.';
      this.isLoading = false;
      return;
    }

    this.contactService.getContactById(id).subscribe({
      next: (response) => {
        this.contact = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load contact.';
        this.isLoading = false;
      },
    });
  }
}
