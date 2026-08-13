import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="top-nav">
      <div class="nav-inner">
        <div class="nav-logo">AI Finance Tracker</div>
        <div class="nav-links">
          <a
            routerLink="/"
            routerLinkActive="nav-active"
            [routerLinkActiveOptions]="{ exact: true }"
          >📊 แดชบอร์ด</a>
          <a routerLink="/budgets" routerLinkActive="nav-active">🎯 งบประมาณ</a>
        </div>
        <button
          class="theme-toggle"
          (click)="toggleTheme()"
          [attr.title]="isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  isDark = false;

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
