import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="cat-icon-container"
      [class.has-container]="showContainer && !isCustomImage"
      [class.is-custom-img-wrap]="isCustomImage"
      [style.width.px]="containerDimension"
      [style.height.px]="containerDimension"
      [style.background-color]="isCustomImage ? 'transparent' : (showContainer ? resolvedColor + '1a' : 'transparent')"
      [style.border-color]="isCustomImage ? 'transparent' : (showContainer ? resolvedColor + '40' : 'transparent')"
      [style.color]="resolvedColor"
    >
      <img
        *ngIf="isCustomImage"
        [src]="resolvedIcon"
        [style.width.px]="containerDimension"
        [style.height.px]="containerDimension"
        class="custom-cat-img"
        alt="category icon"
      />

      <ng-container *ngIf="!isCustomImage" [ngSwitch]="resolvedIcon">
        <!-- Income -->
        <svg *ngSwitchCase="'income'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>

        <!-- Utensils (Clean Fork & Knife) -->
        <svg *ngSwitchCase="'utensils'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 3v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3"/>
          <path d="M7 10v11"/>
          <line x1="7" y1="3" x2="7" y2="6"/>
          <path d="M17 3v18"/>
          <path d="M17 3a3 3 0 0 1 3 3v5h-3"/>
        </svg>

        <!-- Coffee -->
        <svg *ngSwitchCase="'coffee'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/>
          <line x1="10" y1="1" x2="10" y2="4"/>
          <line x1="14" y1="1" x2="14" y2="4"/>
        </svg>

        <!-- Car -->
        <svg *ngSwitchCase="'car'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H7.5a1 1 0 0 0-.8.4L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3"/>
          <circle cx="6.5" cy="16.5" r="2.5"/>
          <circle cx="16.5" cy="16.5" r="2.5"/>
        </svg>

        <!-- Shopping Bag -->
        <svg *ngSwitchCase="'shopping-bag'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>

        <!-- Film -->
        <svg *ngSwitchCase="'film'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
          <line x1="7" y1="2" x2="7" y2="22"/>
          <line x1="17" y1="2" x2="17" y2="22"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="2" y1="7" x2="7" y2="7"/>
          <line x1="2" y1="17" x2="7" y2="17"/>
          <line x1="17" y1="17" x2="22" y2="17"/>
          <line x1="17" y1="7" x2="22" y2="7"/>
        </svg>

        <!-- Heart Pulse -->
        <svg *ngSwitchCase="'heart-pulse'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          <path d="M3.22 12H9.5l1.5-3 2 6.5 1.5-3.5h6.28"/>
        </svg>

        <!-- Receipt -->
        <svg *ngSwitchCase="'receipt'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/>
          <path d="M8 7h8"/>
          <path d="M8 12h8"/>
          <path d="M8 17h4"/>
        </svg>

        <!-- Paw -->
        <svg *ngSwitchCase="'paw'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="4" r="2"/>
          <circle cx="18" cy="8" r="2"/>
          <circle cx="20" cy="16" r="2"/>
          <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>
        </svg>

        <!-- Gamepad -->
        <svg *ngSwitchCase="'gamepad'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="6" y1="12" x2="10" y2="12"/>
          <line x1="8" y1="10" x2="8" y2="14"/>
          <line x1="15" y1="13" x2="15.01" y2="13"/>
          <line x1="18" y1="11" x2="18.01" y2="11"/>
          <rect x="2" y="6" width="20" height="12" rx="2"/>
        </svg>

        <!-- Plane -->
        <svg *ngSwitchCase="'plane'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
        </svg>

        <!-- Book -->
        <svg *ngSwitchCase="'book'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>

        <!-- Dumbbell -->
        <svg *ngSwitchCase="'dumbbell'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6.5 6.5h11"/>
          <path d="M6.5 17.5h11"/>
          <path d="m2 10 3-3v10l-3-3Z"/>
          <path d="m22 10-3-3v10l3-3Z"/>
          <path d="M6.5 6.5v11"/>
          <path d="M17.5 6.5v11"/>
        </svg>

        <!-- Home -->
        <svg *ngSwitchCase="'home'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>

        <!-- Gift -->
        <svg *ngSwitchCase="'gift'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 12 20 22 4 22 4 12"/>
          <rect x="2" y="7" width="20" height="5"/>
          <line x1="12" y1="22" x2="12" y2="7"/>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
        </svg>

        <!-- Wrench -->
        <svg *ngSwitchCase="'wrench'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>

        <!-- Soup / Bowl -->
        <svg *ngSwitchCase="'soup'" viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/>
          <path d="M8 8V4"/>
          <path d="M12 8V4"/>
          <path d="M16 8V4"/>
        </svg>

        <!-- Folder / Default -->
        <svg *ngSwitchDefault viewBox="0 0 24 24" [style.width.px]="size" [style.height.px]="size" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      </ng-container>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
      vertical-align: middle;
      flex-shrink: 0;
      line-height: 0;
    }
    .cat-icon-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }
    .cat-icon-container.has-container {
      border-radius: 12px;
      border: 1px solid transparent;
    }
    .cat-icon-container.is-custom-img-wrap {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
    }
    .custom-cat-img {
      object-fit: cover;
      aspect-ratio: 1 / 1;
      border-radius: 10px;
      display: block;
      flex-shrink: 0;
      max-width: 100%;
      max-height: 100%;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
    }
    svg {
      display: block;
      flex-shrink: 0;
    }
  `]
})
export class CategoryIconComponent {
  private categoryService = inject(CategoryService);

  @Input() category: string = '';
  @Input() icon?: string;
  @Input() color?: string;
  @Input() size: number = 20;
  @Input() type?: string;
  @Input() showContainer: boolean = false;

  get containerDimension(): number {
    return this.showContainer ? this.size + 16 : this.size;
  }

  get resolvedIcon(): string {
    if (this.icon) return this.icon;
    if (this.type === 'income' || this.category === 'รายรับ') return 'income';
    return this.categoryService.getCategoryIcon(this.category);
  }

  get resolvedColor(): string {
    if (this.color) return this.color;
    if (this.type === 'income' || this.category === 'รายรับ') return '#10b981';
    return this.categoryService.getCategoryColor(this.category);
  }

  get isCustomImage(): boolean {
    const ic = this.resolvedIcon;
    return !!ic && (ic.startsWith('data:image/') || ic.startsWith('http://') || ic.startsWith('https://') || ic.startsWith('/') || ic.startsWith('blob:'));
  }
}
