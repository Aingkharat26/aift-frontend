import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Category,
  CategoryService,
  PRESET_COLORS,
  PRESET_ICONS,
} from '../../services/category.service';
import {
  SicButtonComponent,
  SicBadgeComponent,
  SicDialogComponent,
} from 'sic-ng';
import { CategoryIconComponent } from '../category-icon/category-icon.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SicButtonComponent,
    SicBadgeComponent,
    SicDialogComponent,
    CategoryIconComponent,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  categoryService = inject(CategoryService);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  // Modals state
  showFormModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  editingId: number | null = null;
  isSubmitting = signal<boolean>(false);

  showDeleteModal = signal<boolean>(false);
  selectedCategory: Category | null = null;
  isDeleting = signal<boolean>(false);

  showNoticeModal = signal<boolean>(false);
  noticeMessage = '';

  // Form model
  formName = '';
  formIcon = 'folder';
  formColor = '#0ea5e9';
  isCustomImage = signal<boolean>(false);

  readonly presetColors = PRESET_COLORS;
  readonly presetIcons = PRESET_ICONS;

  get totalCategories(): number {
    return this.categoryService.categories.length;
  }

  get defaultCount(): number {
    return this.categoryService.categories.filter((c) => c.isDefault).length;
  }

  get customCount(): number {
    return this.categoryService.categories.filter((c) => !c.isDefault).length;
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.editingId = null;
    this.formName = '';
    this.formIcon = 'folder';
    this.formColor = '#0ea5e9';
    this.isCustomImage.set(false);
    this.showFormModal.set(true);
  }

  openEditModal(category: Category): void {
    if (category.isDefault) {
      this.noticeMessage = 'ไม่สามารถแก้ไขหมวดหมู่เริ่มต้นของระบบได้';
      this.showNoticeModal.set(true);
      return;
    }
    this.isEditing.set(true);
    this.editingId = category.id;
    this.formName = category.name;
    this.formIcon = category.icon || 'folder';
    this.formColor = category.color || '#0ea5e9';
    const isImg = !!(
      this.formIcon.startsWith('data:image/') ||
      this.formIcon.startsWith('http://') ||
      this.formIcon.startsWith('https://') ||
      this.formIcon.startsWith('blob:')
    );
    this.isCustomImage.set(isImg);
    this.showFormModal.set(true);
  }

  selectIcon(iconId: string): void {
    this.formIcon = iconId;
    this.isCustomImage.set(false);
  }

  selectColor(hex: string): void {
    this.formColor = hex;
  }

  onCustomColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.value) {
      this.formColor = input.value;
    }
  }

  onHexInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.trim();
    if (!val.startsWith('#')) {
      val = '#' + val;
    }
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      this.formColor = val;
    }
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.noticeMessage = 'กรุณาเลือกไฟล์รูปภาพเท่านั้น (PNG, JPG, WebP, SVG)';
      this.showNoticeModal.set(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Optimize & resize image into 128x128 thumbnail
        const canvas = document.createElement('canvas');
        const size = 128;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const scale = Math.max(size / img.width, size / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const x = (size - w) / 2;
          const y = (size - h) / 2;
          ctx.drawImage(img, x, y, w, h);
          const dataUrl = canvas.toDataURL('image/webp', 0.88);
          this.formIcon = dataUrl;
          this.isCustomImage.set(true);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset file input value so selecting the same file triggers change again
    input.value = '';
  }

  removeCustomImage(): void {
    this.formIcon = 'folder';
    this.isCustomImage.set(false);
  }

  submitForm(): void {
    const name = this.formName.trim();
    if (!name) {
      this.noticeMessage = 'กรุณากรอกชื่อหมวดหมู่';
      this.showNoticeModal.set(true);
      return;
    }

    this.isSubmitting.set(true);

    if (this.isEditing() && this.editingId) {
      this.categoryService
        .updateCategory(this.editingId, {
          name,
          icon: this.formIcon,
          color: this.formColor,
        })
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.showFormModal.set(false);
          },
          error: (err) => {
            this.isSubmitting.set(false);
            this.noticeMessage =
              err.error?.message || 'ไม่สามารถแก้ไขหมวดหมู่ได้';
            this.showNoticeModal.set(true);
          },
        });
    } else {
      this.categoryService
        .createCategory({
          name,
          icon: this.formIcon,
          color: this.formColor,
        })
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.showFormModal.set(false);
          },
          error: (err) => {
            this.isSubmitting.set(false);
            this.noticeMessage =
              err.error?.message || 'ไม่สามารถสร้างหมวดหมู่ได้';
            this.showNoticeModal.set(true);
          },
        });
    }
  }

  openDeleteModal(category: Category): void {
    if (category.isDefault) {
      this.noticeMessage = 'ไม่สามารถลบหมวดหมู่เริ่มต้นของระบบได้';
      this.showNoticeModal.set(true);
      return;
    }

    this.selectedCategory = category;

    // Strict requirement: If there are existing expenses, disallow deletion with explicit explanation!
    if ((category.expenseCount || 0) > 0) {
      this.noticeMessage = `ไม่สามารถลบหมวดหมู่ "${category.name}" ได้ เนื่องจากยังมี ${category.expenseCount} รายการใช้จ่ายที่ผูกอยู่กับหมวดหมู่นี้ กรุณาแก้ไขหรือลบรายการเหล่านั้นก่อน`;
      this.showNoticeModal.set(true);
      return;
    }

    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    if (!this.selectedCategory) return;

    this.isDeleting.set(true);
    this.categoryService.deleteCategory(this.selectedCategory.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.showDeleteModal.set(false);
        this.selectedCategory = null;
      },
      error: (err) => {
        this.isDeleting.set(false);
        this.noticeMessage =
          err.error?.message || 'เกิดข้อผิดพลาดในการลบหมวดหมู่';
        this.showNoticeModal.set(true);
      },
    });
  }

  isImage(icon?: string): boolean {
    if (!icon) return false;
    return (
      icon.startsWith('data:image/') ||
      icon.startsWith('http://') ||
      icon.startsWith('https://') ||
      icon.startsWith('/') ||
      icon.startsWith('blob:')
    );
  }
}
