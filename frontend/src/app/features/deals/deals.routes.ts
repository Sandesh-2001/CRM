import { Routes } from '@angular/router';

export const DEALS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./deals-pipeline/deals-pipeline.component').then(
        (m) => m.DealsPipelineComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./deal-form/deal-form.component').then(
        (m) => m.DealFormComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./deal-form/deal-form.component').then(
        (m) => m.DealFormComponent,
      ),
  },
];
