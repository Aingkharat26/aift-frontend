import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TransactionService,
  TransactionItem,
  TransactionFilter,
  TransactionResponse,
} from '../../services/transaction.service';
import {
  SicCardComponent,
  SicButtonComponent,
  SicBadgeComponent,
  SicDialogComponent,
  SicInputComponent,
} from 'sic-ng';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SicCardComponent,
    SicButtonComponent,
    SicBadgeComponent,
    SicDialogComponent,
    SicInputComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  private transactionService = inject(TransactionService);

  // Data states
  loading = signal<boolean>(true);
  exporting = signal<boolean>(false);
  transactions = signal<TransactionItem[]>([]);
  totalCount = signal<number>(0);
  page = signal<number>(1);
  limit = signal<number>(20);
  totalPages = signal<number>(1);
  categories = signal<string[]>([]);

  // Summary
  totalIncome = signal<number>(0);
  totalExpense = signal<number>(0);
  netBalance = signal<number>(0);

  // Filters
  keyword: string = '';
  selectedType: 'all' | 'expense' | 'income' = 'all';
  selectedCategory: string = 'all';
  selectedDatePreset: 'this_month' | 'last_month' | '7_days' | '30_days' | 'all' | 'custom' = 'this_month';
  startDate: string = '';
  endDate: string = '';

  private searchTimeout: any;

  // Edit Modal State
  editingItem = signal<TransactionItem | null>(null);
  editFormTitle: string = '';
  editFormAmount: number = 0;
  editFormCategory: string = '';
  isSavingEdit = signal<boolean>(false);

  // Delete Modal State
  deletingItem = signal<TransactionItem | null>(null);
  isDeleting = signal<boolean>(false);

  // Alert/Toast State
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');

  ngOnInit() {
    this.applyDatePreset('this_month', false);
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading.set(true);

    const filter: TransactionFilter = {
      keyword: this.keyword.trim() || undefined,
      type: this.selectedType,
      category: this.selectedCategory !== 'all' ? this.selectedCategory : undefined,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
      page: this.page(),
      limit: this.limit(),
    };

    this.transactionService.getTransactions(filter).subscribe({
      next: (res: TransactionResponse) => {
        this.transactions.set(res.items);
        this.totalCount.set(res.totalCount);
        this.totalPages.set(res.totalPages);
        this.categories.set(res.categories);
        this.totalIncome.set(res.summary.totalIncome);
        this.totalExpense.set(res.summary.totalExpense);
        this.netBalance.set(res.summary.netBalance);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.showToast('ไม่สามารถโหลดข้อมูลรายการได้ กรุณาลองใหม่อีกครั้ง', 'error');
        this.loading.set(false);
      },
    });
  }

  onSearchInput() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.page.set(1);
      this.loadTransactions();
    }, 350);
  }

  clearSearch() {
    this.keyword = '';
    this.page.set(1);
    this.loadTransactions();
  }

  setType(type: 'all' | 'expense' | 'income') {
    if (this.selectedType === type) return;
    this.selectedType = type;
    this.page.set(1);
    this.loadTransactions();
  }

  onCategoryChange() {
    this.page.set(1);
    this.loadTransactions();
  }

  applyDatePreset(preset: 'this_month' | 'last_month' | '7_days' | '30_days' | 'all' | 'custom', reload = true) {
    this.selectedDatePreset = preset;
    const now = new Date();

    if (preset === 'this_month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
    } else if (preset === 'last_month') {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
    } else if (preset === '7_days') {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(now);
    } else if (preset === '30_days') {
      const start = new Date(now);
      start.setDate(now.getDate() - 29);
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(now);
    } else if (preset === 'all') {
      this.startDate = '';
      this.endDate = '';
    }

    if (reload) {
      this.page.set(1);
      this.loadTransactions();
    }
  }

  onCustomDateChange() {
    this.page.set(1);
    this.loadTransactions();
  }

  get visiblePages(): (number | '...')[] {
    const total = this.totalPages();
    const current = this.page();
    if (total <= 1) return [1];
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [];
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push('...');
      pages.push(total);
    }
    return pages;
  }

  setPage(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadTransactions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onLimitChange(newLimit: number) {
    this.limit.set(newLimit);
    this.page.set(1);
    this.loadTransactions();
  }

  // Edit Handlers
  openEditModal(item: TransactionItem) {
    this.editingItem.set(item);
    this.editFormTitle = item.title;
    this.editFormAmount = item.amount;
    this.editFormCategory = item.category;
  }

  closeEditModal() {
    this.editingItem.set(null);
  }

  saveEdit() {
    const item = this.editingItem();
    if (!item) return;

    if (!this.editFormTitle.trim()) {
      this.showToast('กรุณากรอกชื่อรายการ', 'error');
      return;
    }
    if (!this.editFormAmount || this.editFormAmount <= 0) {
      this.showToast('กรุณากรอกจำนวนเงินที่ถูกต้อง', 'error');
      return;
    }

    this.isSavingEdit.set(true);
    this.transactionService
      .updateTransaction(item.type, item.id, {
        title: this.editFormTitle.trim(),
        amount: this.editFormAmount,
        category: item.type === 'expense' ? this.editFormCategory : undefined,
      })
      .subscribe({
        next: () => {
          this.isSavingEdit.set(false);
          this.closeEditModal();
          this.showToast('อัปเดตรายการเรียบร้อยแล้ว', 'success');
          this.loadTransactions();
        },
        error: (err) => {
          console.error('Error updating transaction:', err);
          this.isSavingEdit.set(false);
          this.showToast('เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่', 'error');
        },
      });
  }

  // Delete Handlers
  openDeleteModal(item: TransactionItem) {
    this.deletingItem.set(item);
  }

  closeDeleteModal() {
    this.deletingItem.set(null);
  }

  confirmDelete() {
    const item = this.deletingItem();
    if (!item) return;

    this.isDeleting.set(true);
    this.transactionService.deleteTransaction(item.type, item.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.closeDeleteModal();
        this.showToast('ลบรายการเรียบร้อยแล้ว', 'success');
        this.loadTransactions();
      },
      error: (err) => {
        console.error('Error deleting transaction:', err);
        this.isDeleting.set(false);
        this.showToast('เกิดข้อผิดพลาดในการลบรายการ', 'error');
      },
    });
  }

  // Export CSV Handler
  exportCsv() {
    this.exporting.set(true);

    const filter: TransactionFilter = {
      keyword: this.keyword.trim() || undefined,
      type: this.selectedType,
      category: this.selectedCategory !== 'all' ? this.selectedCategory : undefined,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
    };

    this.transactionService.downloadExportCsv(filter).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `aift-transactions-${timestamp}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.exporting.set(false);
        this.showToast('ดาวน์โหลดไฟล์ CSV เรียบร้อยแล้ว (รองรับ Excel ภาษาไทย)', 'success');
      },
      error: (err) => {
        console.error('Export error:', err);
        this.exporting.set(false);
        this.showToast('เกิดข้อผิดพลาดในการส่งออกไฟล์ CSV', 'error');
      },
    });
  }

  // Helpers
  private formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatThaiDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatThaiTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 4000);
  }
}
