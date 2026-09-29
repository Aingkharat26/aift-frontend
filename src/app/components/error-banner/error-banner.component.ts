import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppErrorInfo } from '../../services/error-handler.service';
import { SicButtonComponent } from 'sic-ng';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule, SicButtonComponent],
  template: `
    <div
      *ngIf="errorData()"
      class="error-banner-card"
      [class.compact]="compact"
      [class.has-retry]="canRetry"
    >
      <div class="banner-main">
        <div class="error-icon-box">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <div class="error-content">
          <div class="error-header-row">
            <h4 class="error-title">{{ errorData()?.title }}</h4>
            <button
              *ngIf="dismissible"
              type="button"
              class="btn-dismiss"
              (click)="onDismiss()"
              title="ปิดการแจ้งเตือนนี้"
            >
              ✕
            </button>
          </div>

          <p class="error-message">{{ errorData()?.message }}</p>

          <div class="error-suggestion" *ngIf="errorData()?.suggestion">
            <span class="bulb-icon">💡</span>
            <span class="suggestion-text">{{ errorData()?.suggestion }}</span>
          </div>
        </div>
      </div>

      <div class="banner-actions" *ngIf="canRetry && !compact">
        <sic-button
          variant="solid"
          color="danger"
          size="sm"
          (click)="onRetryClick()"
        >
          🔄 ลองใหม่อีกครั้ง
        </sic-button>
      </div>
      <div class="banner-actions-compact" *ngIf="canRetry && compact">
        <button type="button" class="btn-retry-compact" (click)="onRetryClick()">
          ลองใหม่
        </button>
      </div>
    </div>
  `,
  styles: [`
    .error-banner-card {
      background: rgba(239, 68, 68, 0.06);
      border: 1px solid rgba(239, 68, 68, 0.25);
      border-left: 4px solid #ef4444;
      border-radius: 14px;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 4px 16px rgba(239, 68, 68, 0.05);
      animation: slideInDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      margin: 8px 0;
    }

    [data-theme='dark'] .error-banner-card {
      background: rgba(239, 68, 68, 0.12);
      border-color: rgba(239, 68, 68, 0.35);
      border-left-color: #f87171;
    }

    .banner-main {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .error-icon-box {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    [data-theme='dark'] .error-icon-box {
      background: rgba(239, 68, 68, 0.25);
      color: #f87171;
    }

    .error-content {
      flex: 1;
      min-width: 0;
    }

    .error-header-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 4px;
    }

    .error-title {
      font-size: 0.98rem;
      font-weight: 700;
      color: #dc2626;
      margin: 0;
    }

    [data-theme='dark'] .error-title {
      color: #f87171;
    }

    .status-pill {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 1px 7px;
      border-radius: 6px;
      background: rgba(239, 68, 68, 0.14);
      color: #ef4444;
      letter-spacing: 0.03em;
    }

    .btn-dismiss {
      margin-left: auto;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.95rem;
      padding: 2px 6px;
      border-radius: 6px;
      transition: all 0.2s;

      &:hover {
        background: rgba(0, 0, 0, 0.08);
        color: var(--text-color);
      }
    }

    .error-message {
      font-size: 0.88rem;
      color: var(--text-color);
      line-height: 1.5;
      margin: 0 0 6px;
    }

    .error-suggestion {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 0.82rem;
      color: #b45309;
      line-height: 1.45;
      margin-top: 6px;

      .bulb-icon {
        font-size: 0.9rem;
        flex-shrink: 0;
      }
    }

    [data-theme='dark'] .error-suggestion {
      background: rgba(245, 158, 11, 0.14);
      border-color: rgba(245, 158, 11, 0.35);
      color: #fbbf24;
    }

    .tech-section {
      margin-top: 8px;
    }

    .btn-toggle-raw {
      background: transparent;
      border: none;
      font-size: 0.76rem;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0;
      text-decoration: underline;

      &:hover {
        color: var(--text-color);
      }
    }

    .raw-code-box {
      margin-top: 6px;
      padding: 8px 12px;
      background: rgba(15, 23, 42, 0.06);
      border-radius: 8px;
      font-family: monospace;
      font-size: 0.76rem;
      color: var(--text-color);
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    [data-theme='dark'] .raw-code-box {
      background: rgba(0, 0, 0, 0.3);
    }

    .banner-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 4px;
      border-top: 1px dashed rgba(239, 68, 68, 0.2);
    }

    /* Compact mode (for small chat inputs or inline cards) */
    .error-banner-card.compact {
      padding: 8px 12px;
      border-left-width: 3px;
      gap: 6px;

      .error-icon-box {
        width: 28px;
        height: 28px;

        svg {
          width: 16px;
          height: 16px;
        }
      }

      .error-title {
        font-size: 0.85rem;
      }

      .error-message {
        font-size: 0.8rem;
        margin-bottom: 2px;
      }

      .error-suggestion {
        padding: 4px 8px;
        font-size: 0.76rem;
      }
    }

    .btn-retry-compact {
      background: #ef4444;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 3px 10px;
      font-size: 0.76rem;
      font-weight: 600;
      cursor: pointer;
      margin-left: auto;
      display: inline-block;

      &:hover {
        background: #dc2626;
      }
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
})
export class ErrorBannerComponent {
  private _error: AppErrorInfo | null = null;
  errorData = signal<AppErrorInfo | null>(null);

  @Input()
  set error(value: AppErrorInfo | string | null | undefined) {
    if (!value) {
      this._error = null;
      this.errorData.set(null);
    } else if (typeof value === 'string') {
      this._error = {
        title: 'เกิดข้อผิดพลาด',
        message: value,
        canRetry: true,
      };
      this.errorData.set(this._error);
    } else {
      this._error = value;
      this.errorData.set(value);
    }
  }
  get error(): AppErrorInfo | null {
    return this._error;
  }

  @Input() compact = false;
  @Input() dismissible = true;

  get canRetry(): boolean {
    return this._error?.canRetry !== false && this.retry.observed;
  }

  @Output() retry = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  onRetryClick() {
    this.retry.emit();
  }

  onDismiss() {
    this.errorData.set(null);
    this.dismiss.emit();
  }
}
