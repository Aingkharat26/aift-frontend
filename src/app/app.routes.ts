import { Routes } from '@angular/router';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { BudgetPageComponent } from './components/budget-page/budget-page.component';

export const routes: Routes = [
  { path: '', component: MainDashboardComponent },
  { path: 'budgets', component: BudgetPageComponent },
];
