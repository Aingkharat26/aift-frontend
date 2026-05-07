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
  template: `
    <div class="dashboard-wrapper">
      <header class="header">
        <div class="header-top">
          <div class="logo-group">
            <div class="logo">AI Finance Tracker</div>
            <div class="subtitle">บันทึกรายจ่ายด้วย AI ใน 3 วินาที</div>
          </div>
          <div class="date-group">
            <app-date-selector></app-date-selector>
          </div>
        </div>
      </header>

      <main class="main-content">
        <div class="top-section">
          <div class="chart-section">
            <app-summary-chart></app-summary-chart>
          </div>
          <div class="log-section">
            <app-daily-log></app-daily-log>
          </div>
        </div>
        
        <div class="bottom-section">
          <app-chat-input></app-chat-input>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header {
      margin-bottom: 30px;
      padding-top: 20px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .logo-group {
      text-align: left;
    }
    .logo {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-color);
      background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }
    .subtitle {
      color: var(--text-muted);
      font-size: 0.95rem;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-height: 0; /* Important for flex child scrolling */
    }
    .top-section {
      display: flex;
      gap: 20px;
      flex: 1;
      min-height: 400px;
    }
    .chart-section {
      flex: 1;
      min-width: 300px;
    }
    .log-section {
      flex: 2;
    }
    .bottom-section {
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .top-section {
        flex-direction: column;
      }
      .chart-section, .log-section {
        flex: none;
        height: auto;
      }
    }
  `]
})
export class MainDashboardComponent {}
