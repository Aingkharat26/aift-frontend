import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  userId?: number | null;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  expenseCount?: number;
  totalExpense?: number;
}

export interface CreateCategoryPayload {
  name: string;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  icon?: string;
  color?: string;
}

export const PRESET_COLORS = [
  { label: 'Amber', hex: '#f59e0b' },
  { label: 'Cyan', hex: '#06b6d4' },
  { label: 'Sky', hex: '#0ea5e9' },
  { label: 'Pink', hex: '#ec4899' },
  { label: 'Orange', hex: '#f97316' },
  { label: 'Emerald', hex: '#10b981' },
  { label: 'Red', hex: '#ef4444' },
  { label: 'Rose', hex: '#fb7185' },
  { label: 'Teal', hex: '#14b8a6' },
  { label: 'Blue', hex: '#3b82f6' },
  { label: 'Slate', hex: '#64748b' },
];

export const PRESET_ICONS = [
  { id: 'utensils', label: 'อาหาร/มีดส้อม' },
  { id: 'soup', label: 'อาหาร/ชามซุป' },
  { id: 'coffee', label: 'เครื่องดื่ม' },
  { id: 'car', label: 'ยานพาหนะ/เดินทาง' },
  { id: 'shopping-bag', label: 'ช้อปปิ้ง' },
  { id: 'film', label: 'บันเทิง' },
  { id: 'heart-pulse', label: 'สุขภาพ/ยา' },
  { id: 'receipt', label: 'บิล/ค่าใช้จ่าย' },
  { id: 'paw', label: 'สัตว์เลี้ยง' },
  { id: 'gamepad', label: 'เกม/ของเล่น' },
  { id: 'plane', label: 'ท่องเที่ยว' },
  { id: 'book', label: 'การศึกษา/หนังสือ' },
  { id: 'dumbbell', label: 'ออกกำลังกาย/กีฬา' },
  { id: 'home', label: 'ที่พัก/บ้าน' },
  { id: 'gift', label: 'ของขวัญ' },
  { id: 'wrench', label: 'ซ่อมแซม' },
  { id: 'folder', label: 'ทั่วไป/อื่นๆ' },
];

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categories`;

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.loadCategories();
  }

  get categories(): Category[] {
    return this.categoriesSubject.value;
  }

  loadCategories(): void {
    this.http
      .get<{ success: boolean; data: Category[] }>(this.apiUrl)
      .subscribe({
        next: (res) => {
          if (res.success && Array.isArray(res.data)) {
            this.categoriesSubject.next(res.data);
          }
        },
        error: () => {
          // If unauthenticated or network error
        },
      });
  }

  createCategory(payload: CreateCategoryPayload): Observable<Category> {
    return this.http
      .post<{ success: boolean; data: Category }>(this.apiUrl, payload)
      .pipe(
        map((res) => res.data),
        tap(() => this.loadCategories())
      );
  }

  updateCategory(id: number, payload: UpdateCategoryPayload): Observable<Category> {
    return this.http
      .patch<{ success: boolean; data: Category }>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        map((res) => res.data),
        tap(() => this.loadCategories())
      );
  }

  deleteCategory(id: number): Observable<{ success: boolean; message: string }> {
    return this.http
      .delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.loadCategories())
      );
  }

  private defaultCategoryMap: Record<string, { icon: string; color: string }> = {
    อาหาร: { icon: 'utensils', color: '#f59e0b' },
    เครื่องดื่ม: { icon: 'coffee', color: '#06b6d4' },
    เดินทาง: { icon: 'car', color: '#0ea5e9' },
    ช้อปปิ้ง: { icon: 'shopping-bag', color: '#ec4899' },
    บันเทิง: { icon: 'film', color: '#f97316' },
    สุขภาพ: { icon: 'heart-pulse', color: '#10b981' },
    บิล: { icon: 'receipt', color: '#ef4444' },
    สัตว์เลี้ยง: { icon: 'paw', color: '#fb7185' },
    อื่นๆ: { icon: 'folder', color: '#64748b' },
  };

  getCategoryByName(name: string): Category | undefined {
    return this.categoriesSubject.value.find((c) => c.name === name);
  }

  getCategoryColor(name: string): string {
    const cat = this.getCategoryByName(name);
    if (cat?.color) return cat.color;
    return this.defaultCategoryMap[name]?.color || '#64748b';
  }

  getCategoryIcon(name: string): string {
    const cat = this.getCategoryByName(name);
    if (cat?.icon) return cat.icon;
    return this.defaultCategoryMap[name]?.icon || 'folder';
  }
}
