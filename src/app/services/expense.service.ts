import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Expense {
  id: number;
  date: string;
  item: string;
  amount: number;
  category: string;
}

export interface CategorySummary {
  category: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/expenses';

  constructor() {
    this.setSelectedDate(new Date());
  }

  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  public expenses$ = this.expensesSubject.asObservable();

  get currentExpenses(): Expense[] {
    return this.expensesSubject.value;
  }

  private summarySubject = new BehaviorSubject<CategorySummary[]>([]);
  public summary$ = this.summarySubject.asObservable();

  private selectedDateSubject = new BehaviorSubject<Date>(new Date());
  public selectedDate$ = this.selectedDateSubject.asObservable();

  private prevYear?: number;
  private prevMonth?: number;

  getSelectedDate(): Date {
    return this.selectedDateSubject.value;
  }


  refreshDailyLogs() {
    const current = this.selectedDateSubject.value;
    const dateStr = this.formatDate(current);
    this.loadDailyExpenses(dateStr);
    this.loadMonthlySummary(current.getFullYear(), current.getMonth() + 1);
  }

  setSelectedDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    this.selectedDateSubject.next(date);
    this.refreshDailyLogs();
  }

  // Use simple methods that just perform the HTTP call and update the subject.
  // To really avoid race conditions with multiple clicks, we'll use a local 'latest' check.
  private dailyReqCount = 0;
  loadDailyExpenses(date: string) {
    const reqId = ++this.dailyReqCount;
    this.http.get<{success: boolean, data: Expense[]}>(`${this.apiUrl}/daily?date=${date}`)
      .subscribe({
        next: (res) => {
          if (reqId === this.dailyReqCount && res.success) {
            this.expensesSubject.next(res.data);
          }
        },
        error: () => {
          if (reqId === this.dailyReqCount) this.expensesSubject.next([]);
        }
      });
  }

  private summaryReqCount = 0;
  loadMonthlySummary(year: number, month: number) {
    const reqId = ++this.summaryReqCount;
    this.http.get<{success: boolean, data: CategorySummary[]}>(`${this.apiUrl}/summary?year=${year}&month=${month}`)
      .subscribe({
        next: (res) => {
          if (reqId === this.summaryReqCount && res.success) {
            this.summarySubject.next(res.data);
          }
        },
        error: () => {
          if (reqId === this.summaryReqCount) this.summarySubject.next([]);
        }
      });
  }

  processChat(text: string): Observable<any> {
    return this.http.post<{success: boolean, data: Expense}>(`${this.apiUrl}/chat`, { text }).pipe(
      tap(() => {
        const current = this.selectedDateSubject.value;
        this.loadDailyExpenses(this.formatDate(current));
        this.loadMonthlySummary(current.getFullYear(), current.getMonth() + 1);
      })
    );
  }

  updateExpense(id: number, data: { item?: string; amount?: number; category?: string }): Observable<any> {
    return this.http.patch<{success: boolean, data: Expense}>(`${this.apiUrl}/${id}`, data).pipe(
      tap(() => {
        const current = this.selectedDateSubject.value;
        this.loadDailyExpenses(this.formatDate(current));
        this.loadMonthlySummary(current.getFullYear(), current.getMonth() + 1);
      })
    );
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.selectedDateSubject.value;
        this.loadDailyExpenses(this.formatDate(current));
        this.loadMonthlySummary(current.getFullYear(), current.getMonth() + 1);
      })
    );
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
