import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AdminModelLimitsComponent } from './components/admin-model-limits/admin-model-limits.component';
import { SicButtonComponent, SicBadgeComponent, SicThemeService } from 'sic-ng';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AdminModelLimitsComponent,
    SicButtonComponent,
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
          <a routerLink="/transactions" routerLinkActive="nav-active">รายการทั้งหมด</a>
        </div>

        <div class="nav-actions">
          <!-- Admin Model Limits Button -->
          <sic-button
            *ngIf="authService.isAdmin()"
            variant="outline"
            color="primary"
            size="sm"
            (click)="showModelLimits.set(true)"
            title="ดูขีดจำกัดโมเดล AI และสถานะ Quota (สิทธิ์ Admin)"
          >
            <span class="admin-models-text">สถานะโมเดล AI</span>
          </sic-button>

          <button
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
            <sic-button
              variant="outline"
              color="danger"
              size="sm"
              (click)="authService.logout()"
              title="ออกจากระบบ"
            >
              🚪 <span class="logout-text">ออกจากระบบ</span>
            </sic-button>
          </ng-container>
        </div>
      </div>
    </nav>
    <router-outlet></router-outlet>

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
