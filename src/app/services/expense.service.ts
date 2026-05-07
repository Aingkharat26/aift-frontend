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

  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  public expenses$ = this.expensesSubject.asObservable();

  private summarySubject = new BehaviorSubject<CategorySummary[]>([]);
  public summary$ = this.summarySubject.asObservable();

  loadDailyExpenses() {
    this.http.get<{success: boolean, data: Expense[]}>(`${this.apiUrl}/daily`)
      .subscribe(res => {
        if (res.success) this.expensesSubject.next(res.data);
      });
  }

  loadMonthlySummary() {
    this.http.get<{success: boolean, data: CategorySummary[]}>(`${this.apiUrl}/summary`)
      .subscribe(res => {
        if (res.success) this.summarySubject.next(res.data);
      });
  }

  processChat(text: string): Observable<any> {
    return this.http.post<{success: boolean, data: Expense}>(`${this.apiUrl}/chat`, { text }).pipe(
      tap(() => {
        this.loadDailyExpenses();
        this.loadMonthlySummary();
      })
    );
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.loadDailyExpenses();
        this.loadMonthlySummary();
      })
    );
  }
}
