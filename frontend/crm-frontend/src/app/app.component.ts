import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { TopNavbarComponent } from './shared/top-navbar/top-navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopNavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sidebarCollapsed = false;
  sidebarOpen = false;
  currentPageTitle = '';
  currentPageSubtitle = '';

  get currentUser$() {
    return this.authService.currentUser$;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updatePageInfo(event.url);
      });
  }

  toggleSidebar(): void {
    if (window.innerWidth <= 768) {
      this.sidebarOpen = !this.sidebarOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  private updatePageInfo(url: string): void {
    const pageInfo = this.getPageInfoFromUrl(url);
    this.currentPageTitle = pageInfo.title;
    this.currentPageSubtitle = pageInfo.subtitle;
  }

  private getPageInfoFromUrl(url: string): { title: string; subtitle: string } {
    if (url.includes('/dashboard')) {
      return { title: 'Dashboard', subtitle: 'Sales summary and key metrics' };
    } else if (url.includes('/contacts')) {
      return { title: 'Contacts', subtitle: 'Manage your contact database' };
    } else if (url.includes('/organizations')) {
      return {
        title: 'Organizations',
        subtitle: 'Company network and relationships',
      };
    } else if (url.includes('/deals')) {
      return { title: 'Deals', subtitle: 'Track opportunities and pipeline' };
    } else if (url.includes('/activities')) {
      return {
        title: 'Activities',
        subtitle: 'Recent activities and interactions',
      };
    } else if (url.includes('/auth/login')) {
      return { title: 'Login', subtitle: 'Welcome back' };
    } else if (url.includes('/auth/register')) {
      return { title: 'Register', subtitle: 'Create your account' };
    }
    return { title: 'CRM Pro', subtitle: 'Professional CRM Dashboard' };
  }

  logout(): void {
    this.authService.logout();
  }
}
