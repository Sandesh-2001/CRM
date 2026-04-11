import { Routes } from '@angular/router';

export const ACTIVITIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./activities-list/activities-list.component').then(
        (m) => m.ActivitiesListComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./activity-form/activity-form.component').then(
        (m) => m.ActivityFormComponent,
      ),
  },
];
