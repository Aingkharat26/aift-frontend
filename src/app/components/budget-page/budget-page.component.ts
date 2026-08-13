import { Component } from '@angular/core';
import { BudgetPanelComponent } from '../budget-panel/budget-panel.component';
import { DateSelectorComponent } from '../date-selector/date-selector.component';

@Component({
  selector: 'app-budget-page',
  standalone: true,
  imports: [BudgetPanelComponent, DateSelectorComponent],
  templateUrl: './budget-page.component.html',
  styleUrl: './budget-page.component.css',
})
export class BudgetPageComponent {}
