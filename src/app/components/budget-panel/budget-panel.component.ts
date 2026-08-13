import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BudgetRecommendation,
  BudgetService,
  BudgetStatus,
} from '../../services/budget.service';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-budget-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-panel.component.html',
  styleUrl: './budget-panel.component.css',
})
export class BudgetPanelComponent implements OnInit {
  private budgetService = inject(BudgetService);
  private expenseService = inject(ExpenseService);
  private cdr = inject(ChangeDetectorRef);

  categories = [
    'อาหาร',
    'เครื่องดื่ม',
    'เดินทาง',
    'ช้อปปิ้ง',
    'บันเทิง',
    'สุขภาพ',
    'บิล',
    'สัตว์เลี้ยง',
    'อื่นๆ',
  ];

  statuses: BudgetStatus[] = [];
  recommendations: BudgetRecommendation[] = [];
  recommendationsLoading = false;

  newBudget = { category: 'อาหาร', limit: 1000 };

  @ViewChild('addDialog') addDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('recommendDialog')
  recommendDialog!: ElementRef<HTMLDialogElement>;

  private currentDate = new Date();
  private prevStatuses: BudgetStatus[] = [];
  private notifiedKeys = new Set<string>(); // ป้องกันแจ้งซ้ำ
  private initialized = false;

  ngOnInit() {
    this.budgetService.loadBudgets();
    this.budgetService.budgets$.subscribe(() => this.reloadStatus());

    this.expenseService.selectedDate$.subscribe((date) => {
      this.currentDate = date;
      this.reloadStatus();
    });

    // รายจ่ายเปลี่ยน (เพิ่ม/แก้ไข/ลบ) → อัปเดตสถานะงบ + เช็คการแจ้งเตือน
    this.expenseService.summary$.subscribe(() => this.reloadStatus());

    this.requestNotificationPermission();
  }

  get alerts(): BudgetStatus[] {
    return this.statuses.filter((s) => s.status !== 'ok');
  }

  get hasBudgets(): boolean {
    return this.statuses.length > 0;
  }

  reloadStatus() {
    const y = this.currentDate.getFullYear();
    const m = this.currentDate.getMonth() + 1;
    this.budgetService.getStatus(y, m).subscribe({
      next: (res) => {
        this.statuses = res;
        this.checkNotifications(res);
        this.prevStatuses = res;
        this.cdr.detectChanges();
      },
      error: () => {
        this.statuses = [];
        this.cdr.detectChanges();
      },
    });
  }

  // แจ้งเตือนเฉพาะตอน "ข้ามเกณฑ์" (ok → warning/exceeded) ในเดือนปัจจุบัน
  private checkNotifications(next: BudgetStatus[]) {
    if (!this.initialized) {
      this.initialized = true;
      this.prevStatuses = next;
      return;
    }

    const now = new Date();
    const isCurrentMonth =
      now.getFullYear() === this.currentDate.getFullYear() &&
      now.getMonth() === this.currentDate.getMonth();
    if (!isCurrentMonth) return;

    for (const item of next) {
      if (item.status === 'ok') continue;
      const before = this.prevStatuses.find((p) => p.id === item.id);
      const key = `${item.id}:${item.status}`;
      if (this.notifiedKeys.has(key)) continue;
      if (!before || before.status === 'ok') {
        this.notifiedKeys.add(key);
        this.showSystemNotification(item);
      }
    }
  }

  private requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }

  private showSystemNotification(item: BudgetStatus) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }
    const fmt = (n: number) => Math.round(n).toLocaleString('th-TH');
    const exceeded = item.status === 'exceeded';
    const title = exceeded
      ? `⛔ เกินงบ ${item.category} แล้ว`
      : `⚠️ ใกล้เกินงบ ${item.category}`;
    const body = `ใช้ไปแล้ว ${fmt(item.spent)} จาก ${fmt(item.limit)} บาท (${item.percentUsed}%)`;
    try {
      new Notification(title, { body });
    } catch {
      // บาง environment ไม่รองรับ — ข้ามไปได้
    }
  }

  getStatusClass(status: string): string {
    return status === 'exceeded'
      ? 'status-exceeded'
      : status === 'warning'
        ? 'status-warning'
        : 'status-ok';
  }

  progressWidth(item: BudgetStatus): number {
    return Math.min(100, item.percentUsed);
  }

  formatNumber(n: number): string {
    return Math.round(n).toLocaleString('th-TH');
  }

  openAddDialog() {
    // ตั้งค่าเริ่มต้นเป็นหมวดที่ยังไม่มีงบ
    const used = new Set(this.statuses.map((s) => s.category));
    const firstFree = this.categories.find((c) => !used.has(c));
    this.newBudget = {
      category: firstFree || this.categories[0],
      limit: 1000,
    };
    this.addDialog.nativeElement.showModal();
  }

  onAddBudget() {
    const limit = Number(this.newBudget.limit);
    if (!this.newBudget.category || isNaN(limit) || limit <= 0) return;

    this.budgetService.saveBudget(this.newBudget.category, limit).subscribe({
      next: () => {
        this.addDialog.nativeElement.close();
        this.reloadStatus();
      },
      error: () => {
        alert('เกิดข้อผิดพลาดในการตั้งงบประมาณ');
      },
    });
  }

  deleteBudget(item: BudgetStatus) {
    if (!confirm(`ลบงบประมาณหมวด ${item.category} ใช่หรือไม่?`)) return;
    this.budgetService.deleteBudget(item.id).subscribe({
      next: () => this.reloadStatus(),
      error: () => alert('เกิดข้อผิดพลาดในการลบงบประมาณ'),
    });
  }

  openRecommendDialog() {
    this.recommendDialog.nativeElement.showModal();
    this.recommendationsLoading = true;
    this.recommendations = [];
    this.cdr.detectChanges();

    this.budgetService.getRecommendations().subscribe({
      next: (res) => {
        this.recommendations = res;
        this.recommendationsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.recommendations = [];
        this.recommendationsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyRecommendation(rec: BudgetRecommendation) {
    this.budgetService
      .saveBudget(rec.category, rec.recommendedBudget)
      .subscribe({
        next: () => {
          rec.currentBudget = rec.recommendedBudget;
          this.reloadStatus();
        },
        error: () => alert('เกิดข้อผิดพลาดในการบันทึกงบประมาณ'),
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
}
