import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-ai-insight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-insight.component.html',
  styleUrl: './ai-insight.component.css',
})
export class AiInsightComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('readMoreDialog') readMoreDialog!: ElementRef<HTMLDialogElement>;

  public aiSummary = '';
  public aiLoading = false;
  public aiFailed = false;

  private currentMonth = new Date();

  // ติดตามสถานะของสรุป AI ที่แสดงอยู่ตอนนี้
  private aiMonthKey?: number; // เดือน (y*100+m) ของสรุปที่แสดง
  private aiVersionAtDisplay = -1; // เวอร์ชันข้อมูลตอนที่สรุปถูกคำนวณ/อ่าน

  ngOnInit() {
    this.expenseService.selectedDate$.subscribe((date) => {
      this.currentMonth = date;
      this.loadAiSummary();
    });

    // รายจ่ายเปลี่ยน (เพิ่ม/แก้ไข/ลบ) → บังคับคำนวณสรุปใหม่
    this.expenseService.summary$.subscribe(() => {
      this.loadAiSummary();
    });
  }

  private loadAiSummary() {
    const y = this.currentMonth.getFullYear();
    const m = this.currentMonth.getMonth() + 1;
    const monthKey = y * 100 + m;
    const version = this.expenseService.getAiDataVersion();

    // กัน request ซ้อนกัน
    if (this.aiLoading) {
      return;
    }

    const monthChanged = this.aiMonthKey !== monthKey;
    const dataChanged = version !== this.aiVersionAtDisplay;

    // F5 หรือเปลี่ยนเดือน → อ่านจาก cache (ไม่เรียก AI)
    // ข้อมูลในเดือนนี้เปลี่ยน (เพิ่ม/แก้ไข/ลบ) → บังคับคำนวณใหม่
    const mode: 'read' | 'refresh' =
      dataChanged && !monthChanged ? 'refresh' : 'read';

    this.aiLoading = true;
    this.aiFailed = false;
    const request =
      mode === 'refresh'
        ? this.expenseService.refreshAiMonthlySummary(y, m)
        : this.expenseService.getAiMonthlySummary(y, m);

    request.subscribe({
      next: (res) => {
        this.aiSummary = res.summary;
        this.aiLoading = false;
        this.aiMonthKey = monthKey;
        this.aiVersionAtDisplay = this.expenseService.getAiDataVersion();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading AI summary:', err);
        this.aiLoading = false;
        this.aiFailed = true;
        this.aiMonthKey = monthKey;
        this.aiVersionAtDisplay = this.expenseService.getAiDataVersion();
        this.cdr.detectChanges();
      },
    });
  }

  getMonthLabel(): string {
    return this.currentMonth.toLocaleDateString('th-TH', {
      month: 'long',
      year: 'numeric',
    });
  }
}
