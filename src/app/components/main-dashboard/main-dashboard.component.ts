import { Component, OnInit } from '@angular/core';
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
export class MainDashboardComponent implements OnInit {
  isDark = false;

  ngOnInit() {
    const saved = localStorage.getItem('aift-theme');
    if (saved === 'dark' || saved === 'light') {
      this.isDark = saved === 'dark';
    } else {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.applyTheme(true);
  }

  private applyTheme(save = false) {
    document.documentElement.setAttribute(
      'data-theme',
      this.isDark ? 'dark' : 'light',
    );
    if (save) {
      localStorage.setItem('aift-theme', this.isDark ? 'dark' : 'light');
    }
  }
}
