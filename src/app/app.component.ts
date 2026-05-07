import { Component } from '@angular/core';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainDashboardComponent],
  template: `<app-main-dashboard></app-main-dashboard>`
})
export class AppComponent {
  title = 'frontend';
}
