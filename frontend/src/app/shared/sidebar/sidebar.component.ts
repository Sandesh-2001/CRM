import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed" [class.open]="open">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">📊</div>
          <span class="logo-text" *ngIf="!collapsed">CRM Pro</span>
        </div>
        <button
          class="toggle-btn"
          (click)="toggleSidebar()"
          [attr.aria-label]="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path *ngIf="!collapsed" d="M15 18l-6-6 6-6" />
            <path *ngIf="collapsed" d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li *ngFor="let item of navItems" class="nav-item">
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              class="nav-link"
              [attr.aria-label]="item.label"
              (click)="onNavClick()"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer" *ngIf="currentUser$ | async as user">
        <div class="user-info" *ngIf="!collapsed">
          <div class="user-avatar">
            {{ (user?.name || user?.email || 'U')[0].toUpperCase() }}
          </div>
          <div class="user-details">
            <div class="user-name">{{ user?.name || 'User' }}</div>
            <div class="user-email">{{ user?.email }}</div>
          </div>
        </div>
        <button
          class="logout-btn"
          (click)="logout()"
          [attr.aria-label]="collapsed ? 'Logout' : 'Logout'"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span *ngIf="!collapsed">Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: [
    `
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 280px;
        background: #ffffff;
        border-right: 1px solid #e5e7eb;
        display: flex;
        flex-direction: column;
        transition: width 0.3s ease;
        z-index: 1000;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      }

      .sidebar.collapsed {
        width: 80px;
      }

      .sidebar-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 80px;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .logo-icon {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: white;
      }

      .logo-text {
        font-size: 1.25rem;
        font-weight: 700;
        color: #111827;
      }

      .toggle-btn {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 6px;
        transition: background-color 0.2s ease;
      }

      .toggle-btn:hover {
        background: #f3f4f6;
      }

      .sidebar-nav {
        flex: 1;
        padding: 1rem 0;
      }

      .nav-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .nav-item {
        margin-bottom: 0.25rem;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1.5rem;
        color: #6b7280;
        text-decoration: none;
        transition: all 0.2s ease;
        border-radius: 0 24px 24px 0;
        margin-right: 1rem;
        position: relative;
      }

      .nav-link:hover {
        background: #f3f4f6;
        color: #111827;
      }

      .nav-link.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .nav-link.active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 24px;
        background: #4f46e5;
        border-radius: 0 2px 2px 0;
      }

      .nav-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        flex-shrink: 0;
      }

      .nav-label {
        font-weight: 500;
        white-space: nowrap;
      }

      .sidebar-footer {
        padding: 1.5rem;
        border-top: 1px solid #e5e7eb;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: #f9fafb;
        border-radius: 8px;
      }

      .user-avatar {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 14px;
      }

      .user-details {
        flex: 1;
        min-width: 0;
      }

      .user-name {
        font-weight: 600;
        color: #111827;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-email {
        color: #6b7280;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .logout-btn {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: #fee2e2;
        color: #dc2626;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .logout-btn:hover {
        background: #fecaca;
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .sidebar {
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar.collapsed {
          width: 280px;
          transform: translateX(-100%);
        }
      }
    `,
  ],
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() open = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() closeMobileMenu = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Contacts', route: '/contacts', icon: '👥' },
    { label: 'Organizations', route: '/organizations', icon: '🏢' },
    { label: 'Deals', route: '/deals', icon: '💼' },
    { label: 'Activities', route: '/activities', icon: '📝' },
  ];

  get currentUser$() {
    return this.authService.currentUser$;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  onNavClick(): void {
    if (window.innerWidth <= 768 && this.open) {
      this.closeMobileMenu.emit();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
