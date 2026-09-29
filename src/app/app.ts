import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AdminModelLimitsComponent } from './components/admin-model-limits/admin-model-limits.component';
import { SicBadgeComponent, SicThemeService } from 'sic-ng';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AdminModelLimitsComponent,
    SicBadgeComponent,
  ],
  template: `
    <nav class="top-nav">
      <div class="nav-inner">
        <div class="nav-logo" routerLink="/">AI Finance Tracker</div>
        <div class="nav-links" *ngIf="authService.isLoggedIn()">
          <a
            routerLink="/"
            routerLinkActive="nav-active"
            [routerLinkActiveOptions]="{ exact: true }"
          >แดชบอร์ด</a>
          <a routerLink="/budgets" routerLinkActive="nav-active">งบประมาณ</a>
          <a routerLink="/categories" routerLinkActive="nav-active">หมวดหมู่</a>
          <a routerLink="/transactions" routerLinkActive="nav-active">รายการทั้งหมด</a>
        </div>

        <div class="nav-actions">
          <!-- Admin Model Limits Button -->
          <button
            *ngIf="authService.isAdmin()"
            type="button"
            class="admin-models-btn"
            (click)="showModelLimits.set(true)"
            title="ดูขีดจำกัดโมเดล AI และสถานะ Quota (สิทธิ์ Admin)"
          >
            <span>⚙️</span>
            <span class="admin-models-text">โมเดล AI</span>
          </button>

          <button
            type="button"
            class="theme-toggle"
            (click)="themeService.toggleDark()"
            [attr.title]="themeService.isDark() ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'"
          >
            {{ themeService.isDark() ? '☀️' : '🌙' }}
          </button>

          <ng-container *ngIf="authService.isLoggedIn()">
            <div
              class="user-badge"
              [title]="
                'เข้าสู่ระบบในชื่อ ' + (authService.currentUser()?.username || '')
              "
            >
              <span class="user-icon">👤</span>
              <span class="user-name">{{
                authService.currentUser()?.displayName ||
                  authService.currentUser()?.username
              }}</span>
              <sic-badge *ngIf="authService.isAdmin()" color="success" size="sm">ADMIN</sic-badge>
            </div>
            <button
              type="button"
              class="logout-btn"
              (click)="authService.logout()"
              title="ออกจากระบบ"
            >
              <span class="logout-icon">🚪</span>
              <span class="logout-text">ออกจากระบบ</span>
            </button>
          </ng-container>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>

    <!-- Mobile Bottom Navigation Bar (iOS Native Tab Bar style) -->
    <nav class="mobile-bottom-nav" *ngIf="authService.isLoggedIn()">
      <a
        routerLink="/"
        routerLinkActive="nav-active"
        [routerLinkActiveOptions]="{ exact: true }"
        class="mobile-tab-link"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>แดชบอร์ด</span>
      </a>

      <a
        routerLink="/budgets"
        routerLinkActive="nav-active"
        class="mobile-tab-link"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
          <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
        </svg>
        <span>งบประมาณ</span>
      </a>

      <a
        routerLink="/categories"
        routerLinkActive="nav-active"
        class="mobile-tab-link"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
        </svg>
        <span>หมวดหมู่</span>
      </a>

      <a
        routerLink="/transactions"
        routerLinkActive="nav-active"
        class="mobile-tab-link"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <circle cx="4" cy="6" r="1.5"></circle>
          <circle cx="4" cy="12" r="1.5"></circle>
          <circle cx="4" cy="18" r="1.5"></circle>
        </svg>
        <span>รายการ</span>
      </a>
    </nav>

    <!-- Admin Model Limits Modal -->
    <app-admin-model-limits
      *ngIf="showModelLimits()"
      (close)="showModelLimits.set(false)"
    ></app-admin-model-limits>
  `,
  styleUrl: './app.scss',
})
export class App {
  authService = inject(AuthService);
  themeService = inject(SicThemeService);
  showModelLimits = signal<boolean>(false);

  constructor() {
    effect(() => {
      const isDark = this.themeService.isDark();
      const mode = isDark ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', mode);
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('aift-theme', mode);
        localStorage.setItem('sic-ng-theme-mode', mode);
      }
    });
  }
}
