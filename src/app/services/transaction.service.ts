import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TransactionItem {
  id: number;
  type: 'expense' | 'income';
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface TransactionFilter {
  keyword?: string;
  type?: 'all' | 'expense' | 'income';
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface TransactionResponse {
  items: TransactionItem[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  summary: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
  };
  categories: string[];
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/transactions`;
  private expensesUrl = `${environment.apiUrl}/expenses`;
  private incomeUrl = `${environment.apiUrl}/income`;

  getTransactions(filter: TransactionFilter): Observable<TransactionResponse> {
    let params = new HttpParams();

    if (filter.keyword) params = params.set('keyword', filter.keyword);
    if (filter.type) params = params.set('type', filter.type);
    if (filter.category && filter.category !== 'all') params = params.set('category', filter.category);
    if (filter.startDate) params = params.set('startDate', filter.startDate);
    if (filter.endDate) params = params.set('endDate', filter.endDate);
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.limit !== undefined) params = params.set('limit', filter.limit.toString());

    return this.http
      .get<{ success: boolean; data: TransactionResponse }>(this.apiUrl, { params })
      .pipe(map((res) => res.data));
  }

  updateTransaction(
    type: 'expense' | 'income',
    id: number,
    data: { title: string; amount: number; category?: string },
  ): Observable<any> {
    if (type === 'expense') {
      return this.http.patch(`${this.expensesUrl}/${id}`, {
        item: data.title,
        amount: data.amount,
        category: data.category,
      });
    } else {
      return this.http.patch(`${this.incomeUrl}/${id}`, {
        source: data.title,
        amount: data.amount,
      });
    }
  }

  deleteTransaction(type: 'expense' | 'income', id: number): Observable<any> {
    if (type === 'expense') {
      return this.http.delete(`${this.expensesUrl}/${id}`);
    } else {
      return this.http.delete(`${this.incomeUrl}/${id}`);
    }
  }

  downloadExportCsv(filter: TransactionFilter): Observable<Blob> {
    let params = new HttpParams();
    if (filter.keyword) params = params.set('keyword', filter.keyword);
    if (filter.type) params = params.set('type', filter.type);
    if (filter.category && filter.category !== 'all') params = params.set('category', filter.category);
    if (filter.startDate) params = params.set('startDate', filter.startDate);
    if (filter.endDate) params = params.set('endDate', filter.endDate);

    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob',
    });
  }
}
