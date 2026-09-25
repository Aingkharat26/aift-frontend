import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BudgetService, BudgetStatus } from '../../services/budget.service';
import { ExpenseService } from '../../services/expense.service';
import {
  SicButtonComponent,
  SicBadgeComponent,
  SicProgressBarComponent,
} from 'sic-ng';
import { CategoryIconComponent } from '../category-icon/category-icon.component';

@Component({
  selector: 'app-mini-budget',
  standalone: true,
  imports: [
    CommonModule,
    SicButtonComponent,
    SicBadgeComponent,
    SicProgressBarComponent,
    CategoryIconComponent,
  ],
  templateUrl: './mini-budget.component.html',
  styleUrls: ['./mini-budget.component.scss'],
})
export class MiniBudgetComponent implements OnInit, OnDestroy {
  private budgetService = inject(BudgetService);
  private expenseService = inject(ExpenseService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  statuses: BudgetStatus[] = [];
  loading = false;
  currentDate = new Date();

  totalBudget = 0;
  totalSpent = 0;
  totalPercent = 0;
  overallStatus: 'ok' | 'warning' | 'exceeded' = 'ok';

  private subs = new Subscription();

  ngOnInit() {
    this.subs.add(
      this.expenseService.selectedDate$.subscribe((date) => {
        this.currentDate = date;
        this.loadBudgetStatus();
      }),
    );

    this.subs.add(
      this.expenseService.summary$.subscribe(() => {
        this.loadBudgetStatus();
      }),
    );

    this.subs.add(
      this.budgetService.budgets$.subscribe(() => {
        this.loadBudgetStatus();
      }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadBudgetStatus() {
    const y = this.currentDate.getFullYear();
    const m = this.currentDate.getMonth() + 1;
    this.loading = true;

    this.budgetService.getStatus(y, m).subscribe({
      next: (res) => {
        this.statuses = Array.isArray(res) ? res : [];
        this.calculateOverview();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.statuses = [];
        this.calculateOverview();
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private calculateOverview() {
    let budget = 0;
    let spent = 0;
    for (const item of this.statuses) {
      budget += Number(item.limit) || 0;
      spent += Number(item.spent) || 0;
    }
    this.totalBudget = budget;
    this.totalSpent = spent;
    this.totalPercent =
      budget > 0 ? Math.round((spent / budget) * 100) : 0;

    if (spent > budget && budget > 0) {
      this.overallStatus = 'exceeded';
    } else if (budget > 0 && spent / budget >= 0.8) {
      this.overallStatus = 'warning';
    } else {
      this.overallStatus = 'ok';
    }
  }

  get sortedStatuses(): BudgetStatus[] {
    // แสดงรายการที่ใช้เปอร์เซ็นต์เยอะสุด หรือเกินงบก่อน
    return [...this.statuses].sort(
      (a, b) => (b.percentUsed || 0) - (a.percentUsed || 0),
    );
  }

  get hasBudgets(): boolean {
    return this.statuses.length > 0;
  }

  get alertCount(): number {
    return this.statuses.filter((s) => s.status !== 'ok').length;
  }

  getStatusClass(status: string): string {
    return status === 'exceeded'
      ? 'status-exceeded'
      : status === 'warning'
        ? 'status-warning'
        : 'status-ok';
  }

  progressWidth(item: BudgetStatus): number {
    return Math.min(100, Math.max(0, item.percentUsed || 0));
  }

  overallProgressWidth(): number {
    return Math.min(100, Math.max(0, this.totalPercent));
  }

  formatNumber(n: number): string {
    return Math.round(n || 0).toLocaleString('th-TH');
  }

  getMonthLabel(): string {
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
      'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
      'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
    ];
    return thaiMonths[this.currentDate.getMonth()];
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      อาหาร: '🍔',
      เครื่องดื่ม: '☕',
      เดินทาง: '🚗',
      ช้อปปิ้ง: '🛍️',
      บันเทิง: '🎬',
      สุขภาพ: '💊',
      บิล: '🧾',
      สัตว์เลี้ยง: '🐱',
      อื่นๆ: '📦',
    };
    return icons[category] || '🏷️';
  }

  navigateToBudgets() {
    this.router.navigate(['/budgets']);
  }
}
