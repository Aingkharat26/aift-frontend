import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private apiUrl = 'http://localhost:3000/income';

  constructor(private http: HttpClient) {}

  addIncome(source: string, amount: number): Observable<any> {
    return this.http.post(this.apiUrl, { source, amount });
  }

  processChat(text: string): Observable<any> {
    return this.http.post<{ success: boolean, data: any }>(`${this.apiUrl}/chat`, { text }).pipe(
      map(res => res.data)
    );
  }

  getDailyIncome(date: string): Observable<any[]> {
    return this.http.get<{ success: boolean, data: any[] }>(`${this.apiUrl}/daily?date=${date}`).pipe(
      map(res => res.data)
    );
  }

  getMonthlySummary(year?: number, month?: number): Observable<{ total: number }> {
    let url = `${this.apiUrl}/summary`;
    if (year && month) {
      url += `?year=${year}&month=${month}`;
    }
    return this.http.get<{ success: boolean, data: { total: number } }>(url).pipe(
      map(res => res.data)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
