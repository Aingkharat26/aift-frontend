import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { IncomeService } from '../../services/income.service';
import { forkJoin, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-daily-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-log.component.html',
  styleUrl: './daily-log.component.css',
})
export class DailyLogComponent implements OnInit {
  expenseService = inject(ExpenseService);
  incomeService = inject(IncomeService);
  private cdr = inject(ChangeDetectorRef);

  combinedLogs: any[] = [];
  selectedItem: any = null;
  editingItem: any = null;
  editForm = { name: '', amount: 0, category: 'อาหาร' };
  categories = ['อาหาร', 'เครื่องดื่ม', 'เดินทาง', 'ช้อปปิ้ง', 'บันเทิง', 'สุขภาพ', 'บิล', 'สัตว์เลี้ยง', 'อื่นๆ'];
  currentDate = new Date();
  public loading = true;

  ngOnInit() {
    this.expenseService.selectedDate$.subscribe((date) => {
      this.currentDate = date;
      this.loadCombinedLogs();
    });

    // Refresh when expenses change (e.g. after adding via chat)
    this.expenseService.expenses$.subscribe(() => {
      this.loadCombinedLogs();
    });
  }

  loadCombinedLogs() {
    this.loading = true;

    // Use local date parts instead of toISOString() to avoid UTC shift
    const y = this.currentDate.getFullYear();
    const m = String(this.currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(this.currentDate.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    // Use of() to get current value of BehaviorSubject or pipe with take(1)
    forkJoin({
      expenses: of(this.expenseService.currentExpenses),
      income: this.incomeService.getDailyIncome(dateStr),
    }).subscribe({
      next: (res: { expenses: any[]; income: any[] }) => {
        const expenses = res.expenses.map((e: any) => ({ ...e, type: 'expense' }));
        const income = res.income.map((i: any) => ({
          ...i,
          type: 'income',
          name: i.source,
          category: 'รายรับ',
        }));

        this.combinedLogs = [...expenses, ...income].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading logs:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
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

  editItem(item: any, dialog: HTMLDialogElement) {
    this.editingItem = item;
    this.editForm = {
      name: item.type === 'income' ? item.source : item.item,
      amount: Number(item.amount),
      category: item.category === 'รายรับ' ? 'อาหาร' : item.category,
    };
    dialog.showModal();
  }

  isEditValid(): boolean {
    const amount = this.editForm.amount;
    return (
      this.editForm.name.trim().length > 0 &&
      !isNaN(amount) &&
      amount >= 0
    );
  }

  onConfirmEdit(dialog: HTMLDialogElement) {
    if (!this.editingItem || !this.isEditValid()) return;

    const isIncome = this.editingItem.type === 'income';
    const data = isIncome
      ? { source: this.editForm.name.trim(), amount: this.editForm.amount }
      : {
          item: this.editForm.name.trim(),
          amount: this.editForm.amount,
          category: this.editForm.category,
        };

    const updateObs = isIncome
      ? this.incomeService.update(this.editingItem.id, data)
      : this.expenseService.updateExpense(this.editingItem.id, data);

    updateObs.subscribe({
      next: () => {
        dialog.close();

        // Refresh summary if it was an income (balance changed)
        if (isIncome) {
          const current = this.expenseService.getSelectedDate();
          this.expenseService.loadMonthlySummary(current.getFullYear(), current.getMonth() + 1);
        }

        this.editingItem = null;
        this.loadCombinedLogs();
      },
      error: (err: any) => {
        console.error('Error updating item:', err);
        alert('เกิดข้อผิดพลาดในการแก้ไขรายการ');
      },
    });
  }

  deleteItem(item: any, dialog: HTMLDialogElement) {
    this.selectedItem = item;
    dialog.showModal();
  }

  onConfirmDelete(dialog: HTMLDialogElement) {
    if (!this.selectedItem) return;

    const isIncome = this.selectedItem.type === 'income';
    const deleteObs = isIncome
      ? this.incomeService.delete(this.selectedItem.id)
      : this.expenseService.deleteExpense(this.selectedItem.id);

    deleteObs.subscribe({
      next: () => {
        dialog.close();

        // Refresh summary if it was an income (balance changed)
        if (isIncome) {
          const current = this.expenseService.getSelectedDate();
          this.expenseService.loadMonthlySummary(current.getFullYear(), current.getMonth() + 1);
        }

        this.selectedItem = null;
        this.loadCombinedLogs();
      },
      error: (err: any) => {
        console.error('Error deleting item:', err);
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
