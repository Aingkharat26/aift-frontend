import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-daily-log',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <div class="daily-log-container">
      <h2 class="title">รายการใช้จ่ายวันนี้</h2>
      
      <div class="empty-state" *ngIf="(expenseService.expenses$ | async)?.length === 0">
        ยังไม่มีรายการใช้จ่ายสำหรับวันนี้ พิมพ์ด้านล่างเพื่อเริ่มบันทึกเลย!
      </div>

      <div class="expense-list" *ngIf="(expenseService.expenses$ | async) as expenses">
        <div class="expense-item" *ngFor="let exp of expenses">
          <div class="item-icon" [ngClass]="getCategoryClass(exp.category)">
            {{ getCategoryIcon(exp.category) }}
          </div>
          <div class="item-details">
            <div class="item-name">{{ exp.item }}</div>
            <div class="item-category">{{ exp.category }}</div>
          </div>
          <div class="item-amount">
            -{{ exp.amount | currency:'THB':'symbol':'1.0-0' }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .daily-log-container {
      background: var(--bg-surface);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      height: 100%;
      overflow-y: auto;
    }
    .title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-color);
      margin-top: 0;
      margin-bottom: 20px;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-muted);
      background: var(--bg-color);
      border-radius: 12px;
      font-size: 0.95rem;
    }
    .expense-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .expense-item {
      display: flex;
      align-items: center;
      padding: 16px;
      background: var(--bg-color);
      border-radius: 12px;
      transition: transform 0.2s ease;
      
      &:hover {
        transform: scale(1.02);
      }
    }
    .item-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-right: 16px;
      background: #f1f5f9;
    }
    .item-details {
      flex: 1;
    }
    .item-name {
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 4px;
    }
    .item-category {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .item-amount {
      font-weight: 700;
      font-size: 1.1rem;
      color: #ef4444; /* red */
    }

    /* Category colors */
    .cat-food { background: #fee2e2; color: #ef4444; }
    .cat-drink { background: #e0f2fe; color: #0ea5e9; }
    .cat-travel { background: #fef3c7; color: #f59e0b; }
    .cat-shopping { background: #f3e8ff; color: #a855f7; }
    .cat-entertainment { background: #ffedd5; color: #f97316; }
    .cat-health { background: #dcfce7; color: #22c55e; }
    .cat-bills { background: #e2e8f0; color: #64748b; }
    .cat-other { background: #f1f5f9; color: #94a3b8; }
  `]
})
export class DailyLogComponent implements OnInit {
  expenseService = inject(ExpenseService);

  ngOnInit() {
    this.expenseService.loadDailyExpenses();
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'อาหาร': '🍔',
      'เครื่องดื่ม': '☕',
      'เดินทาง': '🚗',
      'ช้อปปิ้ง': '🛍️',
      'บันเทิง': '🎬',
      'สุขภาพ': '💊',
      'บิล': '🧾',
      'อื่นๆ': '📦'
    };
    return icons[category] || '📦';
  }

  getCategoryClass(category: string): string {
    const classes: Record<string, string> = {
      'อาหาร': 'cat-food',
      'เครื่องดื่ม': 'cat-drink',
      'เดินทาง': 'cat-travel',
      'ช้อปปิ้ง': 'cat-shopping',
      'บันเทิง': 'cat-entertainment',
      'สุขภาพ': 'cat-health',
      'บิล': 'cat-bills',
      'อื่นๆ': 'cat-other'
    };
    return classes[category] || 'cat-other';
  }
}
