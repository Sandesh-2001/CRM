import { Routes } from '@angular/router';

export const ORGANIZATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./organizations-list/organizations-list.component').then(
        (m) => m.OrganizationsListComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./organization-form/organization-form.component').then(
        (m) => m.OrganizationFormComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./organization-form/organization-form.component').then(
        (m) => m.OrganizationFormComponent,
      ),
  },
];
