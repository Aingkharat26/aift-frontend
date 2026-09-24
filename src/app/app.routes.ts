import { Routes } from '@angular/router';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { BudgetPageComponent } from './components/budget-page/budget-page.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { AuthComponent } from './components/auth/auth.component';
import { authGuard, guestGuard } from './guards/auth.guard';

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
    path: '**',
    redirectTo: '',
  },
];
