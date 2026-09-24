import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AdminModelLimitsComponent } from './components/admin-model-limits/admin-model-limits.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AdminModelLimitsComponent,
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
          >📊 แดชบอร์ด</a>
          <a routerLink="/budgets" routerLinkActive="nav-active">🎯 งบประมาณ</a>
          <a routerLink="/transactions" routerLinkActive="nav-active">📝 รายการทั้งหมด</a>
        </div>

        <div class="nav-actions">
          <!-- Admin Model Limits Button -->
          <button
            *ngIf="authService.isAdmin()"
            class="admin-models-btn"
            (click)="showModelLimits.set(true)"
            title="ดูขีดจำกัดโมเดล AI และสถานะ Quota (สิทธิ์ Admin)"
          >
            👑 <span class="admin-models-text">สถานะโมเดล AI</span>
          </button>

          <button
            class="theme-toggle"
            (click)="toggleTheme()"
            [attr.title]="isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'"
          >
            {{ isDark ? '☀️' : '🌙' }}
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
              <span *ngIf="authService.isAdmin()" class="admin-pill">ADMIN</span>
            </div>
            <button
              class="logout-btn"
              (click)="authService.logout()"
              title="ออกจากระบบ"
            >
              🚪 <span class="logout-text">ออกจากระบบ</span>
            </button>
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
export class App implements OnInit {
  authService = inject(AuthService);
  isDark = false;
  showModelLimits = signal<boolean>(false);

  ngOnInit() {
    const saved = localStorage.getItem('aift-theme');
    if (saved === 'dark' || saved === 'light') {
      this.isDark = saved === 'dark';
    } else {
      this.isDark =
        window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.applyTheme(true);
  }

  private applyTheme(save = false) {
    document.documentElement.setAttribute(
      'data-theme',
      this.isDark ? 'dark' : 'light',
    );
    if (save) {
      localStorage.setItem('aift-theme', this.isDark ? 'dark' : 'light');
    }
  }
}
