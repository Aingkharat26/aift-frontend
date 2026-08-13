import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface Budget {
  id: number;
  category: string;
  limit: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetStatus {
  id: number;
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  status: 'ok' | 'warning' | 'exceeded';
}

export interface BudgetRecommendation {
  category: string;
  months: number;
  avgMonthly: number;
  recommendedBudget: number;
  currentBudget: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/budgets';

  private budgetsSubject = new BehaviorSubject<Budget[]>([]);
  public budgets$ = this.budgetsSubject.asObservable();

  get currentBudgets(): Budget[] {
    return this.budgetsSubject.value;
  }

  loadBudgets() {
    this.http
      .get<{ success: boolean; data: Budget[] }>(`${this.apiUrl}`)
      .subscribe({
        next: (res) => {
          if (res.success) this.budgetsSubject.next(res.data);
        },
        error: () => this.budgetsSubject.next([]),
      });
  }

  saveBudget(category: string, limit: number): Observable<Budget> {
    return this.http
      .post<{ success: boolean; data: Budget }>(this.apiUrl, {
        category,
        limit,
      })
      .pipe(
        map((res) => {
          this.loadBudgets();
          return res.data;
        }),
      );
  }

  deleteBudget(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        this.loadBudgets();
        return res;
      }),
    );
  }

  getRecommendations(): Observable<BudgetRecommendation[]> {
    return this.http
      .get<{ success: boolean; data: BudgetRecommendation[] }>(
        `${this.apiUrl}/recommendations`,
      )
      .pipe(map((res) => res.data));
  }

  getStatus(year: number, month: number): Observable<BudgetStatus[]> {
    return this.http
      .get<{ success: boolean; data: BudgetStatus[] }>(
        `${this.apiUrl}/status?year=${year}&month=${month}`,
      )
      .pipe(map((res) => res.data));
  }
}
