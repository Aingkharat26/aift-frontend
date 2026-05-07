import { Component } from '@angular/core';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';

@Component({
  selector: 'app-root',
  imports: [MainDashboardComponent],
  template: `<app-main-dashboard></app-main-dashboard>`,
  styleUrl: './app.scss'
})
export class App {
  title = 'frontend';
}
