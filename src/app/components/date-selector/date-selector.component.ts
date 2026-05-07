import { Component, inject, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-date-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-selector.component.html',
  styleUrl: './date-selector.component.css'
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
