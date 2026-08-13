import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { DailyLogComponent } from '../daily-log/daily-log.component';
import { SummaryChartComponent } from '../summary-chart/summary-chart.component';
import { DateSelectorComponent } from '../date-selector/date-selector.component';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule, ChatInputComponent, DailyLogComponent, SummaryChartComponent, DateSelectorComponent],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent {}
