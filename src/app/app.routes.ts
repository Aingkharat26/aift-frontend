import { Routes } from '@angular/router';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { BudgetPageComponent } from './components/budget-page/budget-page.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { AuthComponent } from './components/auth/auth.component';
import { authGuard, guestGuard } from './guards/auth.guard';

import { CategoriesComponent } from './components/categories/categories.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: MainDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'budgets',
    component: BudgetPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
