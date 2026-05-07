import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-date-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="datepicker-container">
      <div class="datepicker-label" (click)="triggerPicker()">
        <span class="icon">📅</span>
        <span class="value">{{ getFormattedDate() }}</span>
        <input 
          #dateInput
          type="date" 
          [value]="getISODate()" 
          (change)="onDateChange($event)"
          (click)="$event.stopPropagation()"
          class="native-input"
        >
      </div>
    </div>
  `,
  styles: [`
    .datepicker-container {
      position: relative;
    }

    .datepicker-label {
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      padding: 10px 20px;
      border-radius: 14px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border: 1px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 180px;
      position: relative;
      overflow: hidden;
    }

    .datepicker-label:hover {
      border-color: #0ea5e9;
      box-shadow: 0 6px 20px rgba(14, 165, 233, 0.1);
      transform: translateY(-1px);
    }

    .icon {
      font-size: 1.2rem;
    }

    .value {
      font-weight: 700;
      color: #1e293b;
      font-size: 1rem;
    }

    .native-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      border: none;
      pointer-events: none; /* Let the div/label handle the click via triggerPicker */
    }
  `]
})
export class DateSelectorComponent implements OnInit {
  expenseService = inject(ExpenseService);
  selectedDate = new Date();

  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  ngOnInit() {
    this.expenseService.selectedDate$.subscribe(date => {
      this.selectedDate = date;
    });
  }

  triggerPicker() {
    const input = this.dateInput.nativeElement;
    // If browser supports showPicker(), use it for better experience
    if (typeof input.showPicker === 'function') {
      input.showPicker();
    } else {
      // Fallback
      input.click();
    }
  }

  getFormattedDate(): string {
    const d = this.selectedDate;
    const day = d.getDate();
    const month = this.months[d.getMonth()];
    const year = d.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  }

  getISODate(): string {
    return this.selectedDate.toISOString().split('T')[0];
  }

  onDateChange(event: any) {
    const val = event.target.value;
    if (val) {
      this.expenseService.setSelectedDate(new Date(val));
    }
  }
}
