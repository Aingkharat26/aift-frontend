import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-summary-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, CurrencyPipe],
  template: `
    <div class="chart-container">
      <h2 class="title">สรุปรายจ่ายเดือนนี้</h2>
      <div class="total-spent">
        ฿{{ getTotalSpent() | number:'1.0-0' }}
      </div>
      
      <div class="empty-state" *ngIf="!hasData()">
        ยังไม่มีข้อมูลสำหรับเดือนนี้
      </div>

      <div class="chart-wrapper" *ngIf="hasData()">
        <canvas baseChart
          [data]="pieChartData"
          [options]="pieChartOptions"
          [type]="pieChartType">
        </canvas>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      background: var(--bg-surface);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }
    .title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-color);
      margin-top: 0;
      margin-bottom: 8px;
    }
    .total-spent {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-color);
      margin-bottom: 24px;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-muted);
      background: var(--bg-color);
      border-radius: 12px;
      font-size: 0.95rem;
      width: 100%;
    }
    .chart-wrapper {
      width: 100%;
      max-width: 300px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class SummaryChartComponent implements OnInit {
  expenseService = inject(ExpenseService);

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { family: 'Inter, sans-serif' }
        }
      }
    }
  };
  public pieChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [ {
      data: [],
      backgroundColor: [
        '#ef4444', // อาหาร - red
        '#0ea5e9', // เครื่องดื่ม - blue
        '#f59e0b', // เดินทาง - yellow
        '#a855f7', // ช้อปปิ้ง - purple
        '#f97316', // บันเทิง - orange
        '#22c55e', // สุขภาพ - green
        '#64748b', // บิล - gray
        '#94a3b8'  // อื่นๆ - slate
      ],
      borderWidth: 0
    } ]
  };
  public pieChartType: ChartType = 'doughnut';
  
  private totalSpent = 0;

  ngOnInit() {
    this.expenseService.loadMonthlySummary();
    this.expenseService.summary$.subscribe(summary => {
      this.totalSpent = summary.reduce((sum, item) => sum + item.total, 0);
      
      this.pieChartData = {
        labels: summary.map(s => s.category),
        datasets: [{
          ...this.pieChartData.datasets[0],
          data: summary.map(s => s.total)
        }]
      };
    });
  }

  hasData(): boolean {
    return this.pieChartData.datasets[0].data.length > 0;
  }

  getTotalSpent(): number {
    return this.totalSpent;
  }
}
