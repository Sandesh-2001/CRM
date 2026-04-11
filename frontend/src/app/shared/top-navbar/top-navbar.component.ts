import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="top-navbar">
      <div class="navbar-left">
        <button
          class="menu-toggle"
          (click)="toggleSidebar.emit()"
          [attr.aria-label]="'Toggle sidebar'"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div class="breadcrumb" *ngIf="pageTitle">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <p class="page-subtitle" *ngIf="pageSubtitle">{{ pageSubtitle }}</p>
        </div>
      </div>

      <div class="navbar-right" *ngIf="currentUser$ | async as user">
        <div class="navbar-actions">
          <button class="action-btn" [attr.aria-label]="'Notifications'">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <button class="action-btn" [attr.aria-label]="'Settings'">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              />
            </svg>
          </button>
        </div>

        <div class="user-menu">
          <div class="user-avatar">
            {{ (user?.name || user?.email || 'U')[0].toUpperCase() }}
          </div>
          <div class="user-info">
            <div class="user-name">{{ user?.name || 'User' }}</div>
            <div class="user-role">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .top-navbar {
        position: fixed;
        top: 0;
        left: 280px;
        right: 0;
        height: 80px;
        background: #ffffff;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 2rem;
        z-index: 999;
        transition: left 0.3s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .navbar-left {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .menu-toggle {
        display: none;
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 6px;
        transition: background-color 0.2s ease;
      }

      .menu-toggle:hover {
        background: #f3f4f6;
      }

      .breadcrumb {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .page-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #111827;
        margin: 0;
      }

      .page-subtitle {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0;
      }

      .navbar-right {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .navbar-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .action-btn {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 6px;
        transition: background-color 0.2s ease;
        position: relative;
      }

      .action-btn:hover {
        background: #f3f4f6;
      }

      .user-menu {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .user-menu:hover {
        background: #f9fafb;
      }

      .user-avatar {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 14px;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .user-name {
        font-weight: 600;
        color: #111827;
        font-size: 14px;
      }

      .user-role {
        color: #6b7280;
        font-size: 12px;
      }

      /* Collapsed sidebar */
      :host-context(.sidebar-collapsed) .top-navbar {
        left: 80px;
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .top-navbar {
          left: 0;
          padding: 0 1rem;
        }

        .menu-toggle {
          display: block;
        }

        .page-title {
          font-size: 1.25rem;
        }

        .page-subtitle {
          display: none;
        }

        .navbar-actions {
          display: none;
        }

        .user-info {
          display: none;
        }
      }

      @media (max-width: 480px) {
        .top-navbar {
          height: 64px;
          padding: 0 0.75rem;
        }

        .page-title {
          font-size: 1.125rem;
        }
      }
    `,
  ],
})
export class TopNavbarComponent {
  @Input() pageTitle = '';
  @Input() pageSubtitle = '';
  @Output() toggleSidebar = new EventEmitter<void>();

  get currentUser$() {
    return this.authService.currentUser$;
  }

  constructor(private authService: AuthService) {}
}
