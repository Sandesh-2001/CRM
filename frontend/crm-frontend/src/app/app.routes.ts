import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES,
      ),
  },
  {
    path: 'contacts',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/contacts/contacts.routes').then(
        (m) => m.CONTACTS_ROUTES,
      ),
  },
  {
    path: 'organizations',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/organizations/organizations.routes').then(
        (m) => m.ORGANIZATIONS_ROUTES,
      ),
  },
  {
    path: 'deals',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/deals/deals.routes').then((m) => m.DEALS_ROUTES),
  },
  {
    path: 'activities',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/activities/activities.routes').then(
        (m) => m.ACTIVITIES_ROUTES,
      ),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
