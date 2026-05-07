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
          <button class="delete-btn" (click)="deleteExpense(exp, confirmDialog)" title="ลบรายการนี้">
            <span class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>

    <dialog #confirmDialog class="modal-dialog">
      <div class="dialog-content">
        <h3>ยืนยันการลบรายการ</h3>
        <p>คุณต้องการลบรายการ <strong>"{{ selectedExpense?.item }}"</strong> ใช่หรือไม่?</p>
        
        <div class="dialog-actions">
          <button class="btn-cancel" (click)="confirmDialog.close()">ยกเลิก</button>
          <button class="btn-confirm" (click)="onConfirmDelete(confirmDialog)">ยืนยัน</button>
        </div>
      </div>
    </dialog>
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
      padding: 12px 16px;
      background: var(--bg-color);
      border-radius: 12px;
      position: relative;
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
      color: #ef4444;
      margin-right: 8px;
    }

    .delete-btn {
      opacity: 0;
      pointer-events: auto;
      background: #ffffff;
      border: 1px solid #fecaca;
      border-radius: 10px;
      width: 35px;
      height: 35px; 
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
      color: #ef4444;
    }
    .delete-btn:hover {
      background: #ffffff;
      border-color: #ef4444;  
      transform: scale(1.15);
    }

    @media (hover: hover) {
      .delete-btn {
        opacity: 0;
        pointer-events: none;
      }
      .expense-item:hover .delete-btn {
        opacity: 1;
        pointer-events: auto;
      }
    }

    @media (max-width: 600px) {
      .delete-btn {
        opacity: 1;
        border-color: #fee2e2;
        background: transparent;
        width: 32px;
        height: 32px;
      }
      
      .item-icon {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
      }
      
      .item-amount {
        font-size: 1rem;
      }
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

    /*Dialog*/
    .modal-dialog {
      border: none;
      border-radius: 20px;
      padding: 0;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      max-width: 90%;
      width: 320px;
      margin: auto; 
      position: fixed;
      inset: 0;

      &::backdrop {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }
    }

    .dialog-content {
      padding: 24px;
      text-align: center;

      h3 { margin-top: 0; color: #1e293b; }
      p { color: #334155; margin-bottom: 24px; }
    }

    .dialog-actions {
      display: flex;
      gap: 12px;

      button {
        flex: 1;
        padding: 12px;
        border-radius: 12px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
    }

    .btn-cancel {
      background: #f1f5f9;
      color: #64748b;
      &:hover { background: #e2e8f0; }
    }

    .btn-confirm {
      background: #ef4444;
      color: white;
      &:hover { background: #dc2626; }
    }
  `]
})
export class DailyLogComponent implements OnInit {
  expenseService = inject(ExpenseService);
  selectedExpense: any = null; // เก็บรายการที่เลือกจะลบ
  
  ngOnInit() {
    this.expenseService.loadDailyExpenses();
  }

  deleteExpense(exp: any, dialog: HTMLDialogElement) {
    this.selectedExpense = exp;
    dialog.showModal(); 
  }

  onConfirmDelete(dialog: HTMLDialogElement) {
    if (!this.selectedExpense) return;
    
    this.expenseService.deleteExpense(this.selectedExpense.id).subscribe({
      next: () => {
        this.expenseService.loadDailyExpenses(); 
        dialog.close();
        this.selectedExpense = null;
      },
      error: (err) => {
        console.error('Error deleting expense:', err);
        alert('เกิดข้อผิดพลาดในการลบรายการ');
      }
    });
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
