import { Component, inject, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-date-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="datepicker-container" (click)="$event.stopPropagation()">
      <!-- Toggle Button -->
      <div class="datepicker-trigger" (click)="togglePicker()" [class.active]="showPicker">
        <span class="icon">📅</span>
        <span class="value">{{ getFormattedDate(selectedDate) }}</span>
        <span class="chevron">▼</span>
      </div>

      <!-- Custom Calendar Dropdown -->
      <div class="calendar-dropdown" *ngIf="showPicker">
        <!-- Header: Month & Year Selector -->
        <div class="calendar-header">
          <button (click)="changeMonth(-1)" class="nav-btn">◀</button>
          
          <div class="header-labels">
            <span class="month-label" (click)="viewMode = 'months'">{{ months[viewDate.getMonth()] }}</span>
            <span class="year-label" (click)="viewMode = 'years'">{{ viewDate.getFullYear() + 543 }}</span>
          </div>

          <button (click)="changeMonth(1)" class="nav-btn">▶</button>
        </div>

        <!-- View: Days Grid (Main) -->
        <div class="view-days" *ngIf="viewMode === 'days'">
          <div class="day-names">
            <span *ngFor="let day of dayNames">{{ day }}</span>
          </div>
          <div class="days-grid">
            <!-- Empty slots for previous month -->
            <div *ngFor="let p of paddingDays" class="day padding"></div>
            
            <!-- Actual days -->
            <div 
              *ngFor="let day of daysInMonth" 
              class="day" 
              [class.today]="isToday(day)"
              [class.selected]="isSelected(day)"
              (click)="selectDate(day)"
            >
              {{ day }}
            </div>
          </div>
        </div>

        <!-- View: Months Grid -->
        <div class="view-months" *ngIf="viewMode === 'months'">
          <div class="months-grid">
            <button 
              *ngFor="let m of months; let i = index" 
              (click)="setMonth(i)"
              [class.active]="viewDate.getMonth() === i"
            >
              {{ m }}
            </button>
          </div>
        </div>

        <!-- View: Years Grid -->
        <div class="view-years" *ngIf="viewMode === 'years'">
          <div class="years-header">
            <button (click)="changeYearRange(-1)">«</button>
            <span>{{ yearRangeStart + 543 }} - {{ yearRangeStart + 11 + 543 }}</span>
            <button (click)="changeYearRange(1)">»</button>
          </div>
          <div class="years-grid">
            <button 
              *ngFor="let y of years" 
              (click)="setYear(y)"
              [class.active]="viewDate.getFullYear() === y"
            >
              {{ y + 543 }}
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="calendar-footer">
          <button class="today-btn" (click)="setToday()">วันนี้</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary: #0ea5e9;
      --primary-soft: #e0f2fe;
      --text: #1e293b;
      --text-muted: #64748b;
      --bg: #ffffff;
      --border: #e2e8f0;
      --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }

    .datepicker-container {
      position: relative;
      user-select: none;
    }

    .datepicker-trigger {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--bg);
      padding: 10px 18px;
      border-radius: 14px;
      border: 1px solid var(--border);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    }

    .datepicker-trigger:hover, .datepicker-trigger.active {
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
      transform: translateY(-1px);
    }

    .icon { font-size: 1.2rem; }
    .value { font-weight: 700; color: var(--text); font-size: 0.95rem; }
    .chevron { font-size: 0.6rem; color: var(--text-muted); transition: transform 0.3s; }
    .active .chevron { transform: rotate(180deg); }

    /* Dropdown */
    .calendar-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      width: 300px;
      background: var(--bg);
      border-radius: 20px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      padding: 20px;
      z-index: 1000;
      animation: slideIn 0.2s ease-out;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header-labels {
      display: flex;
      gap: 8px;
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--text);
    }

    .month-label, .year-label {
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .month-label:hover, .year-label:hover {
      background: var(--primary-soft);
      color: var(--primary);
    }

    .nav-btn {
      background: var(--primary-soft);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 10px;
      color: var(--primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      transition: all 0.2s;
    }
    .nav-btn:hover { background: var(--primary); color: white; }

    /* Days View */
    .day-names {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      font-weight: 700;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 10px;
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }

    .day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text);
      transition: all 0.2s;
    }

    .day:hover:not(.padding) {
      background: var(--primary-soft);
      color: var(--primary);
    }

    .day.selected {
      background: var(--primary) !important;
      color: white !important;
      box-shadow: 0 4px 10px rgba(14, 165, 233, 0.4);
    }

    .day.today {
      color: var(--primary);
      position: relative;
    }
    .day.today::after {
      content: '';
      position: absolute;
      bottom: 6px;
      width: 4px;
      height: 4px;
      background: var(--primary);
      border-radius: 50%;
    }

    .day.padding { cursor: default; }

    /* Month/Year Grids */
    .months-grid, .years-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .months-grid button, .years-grid button {
      padding: 12px 8px;
      border: 1px solid var(--border);
      background: white;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: var(--text);
    }

    .months-grid button:hover, .years-grid button:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: var(--primary-soft);
    }

    .months-grid button.active, .years-grid button.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .years-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-weight: 700;
      color: var(--text-muted);
    }
    .years-header button {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--primary);
    }

    /* Footer */
    .calendar-footer {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: center;
    }

    .today-btn {
      background: none;
      border: none;
      color: var(--primary);
      font-weight: 700;
      cursor: pointer;
      padding: 5px 15px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .today-btn:hover { background: var(--primary-soft); }
  `]
})
export class DateSelectorComponent implements OnInit {
  expenseService = inject(ExpenseService);
  el = inject(ElementRef);

  showPicker = false;
  selectedDate = new Date();
  viewDate = new Date(); // Date currently being viewed in calendar
  viewMode: 'days' | 'months' | 'years' = 'days';

  months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  daysInMonth: number[] = [];
  paddingDays: number[] = [];
  years: number[] = [];
  yearRangeStart = new Date().getFullYear() - 5;

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.showPicker = false;
    }
  }

  ngOnInit() {
    this.expenseService.selectedDate$.subscribe(date => {
      this.selectedDate = new Date(date);
      this.viewDate = new Date(date);
      this.generateCalendar();
    });
  }

  togglePicker() {
    this.showPicker = !this.showPicker;
    if (this.showPicker) {
      this.viewDate = new Date(this.selectedDate);
      this.viewMode = 'days';
      this.generateCalendar();
    }
  }

  generateCalendar() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1).getDay();
    // Days in month
    const days = new Date(year, month + 1, 0).getDate();

    this.paddingDays = Array(firstDay).fill(0);
    this.daysInMonth = Array.from({length: days}, (_, i) => i + 1);
    
    this.generateYearRange();
  }

  generateYearRange() {
    this.years = Array.from({length: 12}, (_, i) => this.yearRangeStart + i);
  }

  changeMonth(delta: number) {
    const d = new Date(this.viewDate);
    d.setMonth(d.getMonth() + delta);
    this.viewDate = d;
    this.generateCalendar();
  }

  setMonth(m: number) {
    const d = new Date(this.viewDate);
    d.setMonth(m);
    this.viewDate = d;
    this.viewMode = 'days';
    this.generateCalendar();
  }

  setYear(y: number) {
    const d = new Date(this.viewDate);
    d.setFullYear(y);
    this.viewDate = d;
    this.viewMode = 'days';
    this.generateCalendar();
  }

  changeYearRange(delta: number) {
    this.yearRangeStart += delta * 12;
    this.generateYearRange();
  }

  selectDate(day: number) {
    const newDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
    this.expenseService.setSelectedDate(newDate);
    this.showPicker = false;
  }

  setToday() {
    const today = new Date();
    this.expenseService.setSelectedDate(today);
    this.showPicker = false;
  }

  isToday(day: number): boolean {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === this.viewDate.getMonth() && 
           today.getFullYear() === this.viewDate.getFullYear();
  }

  isSelected(day: number): boolean {
    return this.selectedDate.getDate() === day && 
           this.selectedDate.getMonth() === this.viewDate.getMonth() && 
           this.selectedDate.getFullYear() === this.viewDate.getFullYear();
  }

  getFormattedDate(date: Date): string {
    const day = date.getDate();
    const month = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ][date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  }
}
