import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-daily-log',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './daily-log.component.html',
  styleUrl: './daily-log.component.css'
})
export class DailyLogComponent implements OnInit {
  expenseService = inject(ExpenseService);
  selectedExpense: any = null;
  currentDate = new Date();
  public loading = true;

  ngOnInit() {
    this.expenseService.selectedDate$.subscribe((date) => {
      this.currentDate = date;
      this.loading = true;
    });

    this.expenseService.expenses$.subscribe(() => {
      this.loading = false;
    });
  }

  getSelectedDateLabel(): string {
    const today = new Date();
    if (this.currentDate.toDateString() === today.toDateString()) {
      return 'วันนี้';
    }
    return this.currentDate.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  deleteExpense(exp: any, dialog: HTMLDialogElement) {
    this.selectedExpense = exp;
    dialog.showModal();
  }

  onConfirmDelete(dialog: HTMLDialogElement) {
    if (!this.selectedExpense) return;

    this.expenseService.deleteExpense(this.selectedExpense.id).subscribe({
      next: () => {
        dialog.close();
        this.selectedExpense = null;
      },
      error: (err) => {
        console.error('Error deleting expense:', err);
        alert('เกิดข้อผิดพลาดในการลบรายการ');
      },
    });
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
    return icons[category] || '📦';
  }

  getCategoryClass(category: string): string {
    const classes: Record<string, string> = {
      อาหาร: 'cat-food',
      เครื่องดื่ม: 'cat-drink',
      เดินทาง: 'cat-travel',
      ช้อปปิ้ง: 'cat-shopping',
      บันเทิง: 'cat-entertainment',
      สุขภาพ: 'cat-health',
      บิล: 'cat-bills',
      สัตว์เลี้ยง: 'cat-pet',
      อื่นๆ: 'cat-other',
    };
    return classes[category] || 'cat-other';
  }
}
