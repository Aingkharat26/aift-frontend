import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-summary-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './summary-chart.component.html',
  styleUrl: './summary-chart.component.css'
})
export class SummaryChartComponent implements OnInit {
  expenseService = inject(ExpenseService);
  
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private categoryColors: Record<string, string> = {
    'อาหาร': '#ef4444',
    'เครื่องดื่ม': '#0ea5e9',
    'เดินทาง': '#f59e0b',
    'ช้อปปิ้ง': '#a855f7',
    'บันเทิง': '#f97316',
    'สุขภาพ': '#22c55e',
    'บิล': '#64748b',
    'สัตว์เลี้ยง': '#fb7185',
    'อื่นๆ': '#94a3b8'
  };

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
      backgroundColor: [],
      borderWidth: 0
    } ]
  };
  public pieChartType: ChartType = 'doughnut';
  
  private totalSpent = 0;
  private currentMonth = new Date();
  public loading = true;

  private lastLoadedMonth?: number;
  private lastLoadedYear?: number;

  ngOnInit() {
    this.expenseService.selectedDate$.subscribe(date => {
      const m = date.getMonth();
      const y = date.getFullYear();
      
      // Only show loading if we actually switched months
      if (m !== this.lastLoadedMonth || y !== this.lastLoadedYear) {
        this.loading = true;
      }
      this.currentMonth = date;
    });

    this.expenseService.summary$.subscribe(summary => {
      this.totalSpent = summary.reduce((sum, item) => sum + item.total, 0);
      
      // Set these to track what's currently in the chart
      this.lastLoadedMonth = this.currentMonth.getMonth();
      this.lastLoadedYear = this.currentMonth.getFullYear();

      const chartLabels = summary.map(s => s.category);
      const chartData = summary.map(s => s.total);
      const chartColors = chartLabels.map(label => this.categoryColors[label as string] || '#94a3b8');
      
      this.pieChartData = {
        labels: chartLabels,
        datasets: [{
          ...this.pieChartData.datasets[0],
          data: chartData,
          backgroundColor: chartColors
        }]
      };

      this.loading = false;

      // Force chart update
      setTimeout(() => {
        if (this.chart) {
          this.chart.update();
        }
      }, 0);
    });
  }

  hasData(): boolean {
    return this.pieChartData.datasets[0].data.length > 0;
  }

  getTotalSpent(): number {
    return this.totalSpent;
  }

  getMonthLabel(): string {
    return this.currentMonth.toLocaleDateString('th-TH', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
}
