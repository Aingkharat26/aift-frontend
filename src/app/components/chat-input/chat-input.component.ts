import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-input-container">
      <input
        type="text"
        [(ngModel)]="text"
        (keyup.enter)="onSubmit()"
        placeholder="พิมพ์รายจ่ายของคุณ"
        [disabled]="isLoading"
        class="chat-input"
      />
      <button (click)="onSubmit()" [disabled]="isLoading || !text.trim()" class="send-btn">
        {{ isLoading ? 'กำลังบันทึก...' : 'บันทึก' }}
      </button>
    </div>

    <!-- Dialog สำหรับแจ้งสถานะ AI / Error -->
    <dialog #statusDialog class="modal-dialog">
      <div class="dialog-content">
        <div class="status-icon">{{ statusData.icon }}</div>
        <h3>{{ statusData.title }}</h3>
        <p>{{ statusData.message }}</p>

        <div class="dialog-actions">
          <button class="btn-confirm" (click)="statusDialog.close()">ตกลง</button>
        </div>
      </div>
    </dialog>
  `,
  styles: [
    `
      .chat-input-container {
        display: flex;
        gap: 10px;
        padding: 20px;
        background: var(--bg-surface);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        margin-top: 20px;
      }
      .chat-input {
        flex: 1;
        padding: 16px 20px;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        font-size: 1rem;
        font-family: inherit;
        background: var(--bg-color);
        color: var(--text-color);
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
      }
      .send-btn {
        padding: 0 24px;
        border: none;
        border-radius: 12px;
        background: var(--primary-color);
        color: white;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }
        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }

      .status-icon {
        font-size: 3rem;
        margin-bottom: 16px;
      }

      .modal-dialog {
        border: none;
        border-radius: 24px;
        padding: 0;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        width: 320px;
        background: white;
        margin: auto;
        position: fixed;
        outline: none;
        overflow: hidden;

        &::backdrop {
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(8px);
        }

        .dialog-content {
          padding: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;

          h3 {
            margin: 10px 0;
            color: #1e293b;
            font-size: 1.25rem;
          }

          p {
            color: #64748b;
            margin-bottom: 20px;
            font-size: 1rem;
            line-height: 1.5;
          }
        }

        .dialog-actions {
          width: 100%;
          display: flex;
          gap: 10px;

          button {
            flex: 1;
            padding: 12px;
            border-radius: 12px;
            border: none;
            font-weight: 600;
            cursor: pointer;
          }
        }

        &[open] {
          animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      }
    `,
  ],
})
export class ChatInputComponent {
  text = '';
  isLoading = false;
  private expenseService = inject(ExpenseService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('statusDialog') statusDialog!: ElementRef<HTMLDialogElement>;

  statusData = { title: '', message: '', icon: '' };

  private fixThaiKeyboard(val: string): string {
    const thaiToEngMap: { [key: string]: string } = {
      ๅ: '1',
      '/-': '2',
      ภ: '4',
      ถ: '5',
      'ุ': '6',
      'ึ': '7',
      ค: '8',
      ต: '9',
      จ: '0',
      ข: '-',
      ช: '=',
    };
    return val
      .split('')
      .map((char) => thaiToEngMap[char] || char)
      .join('');
  }

  onSubmit() {
    if (!this.text.trim()) return;
    this.isLoading = true;

    this.expenseService.processChat(this.fixThaiKeyboard(this.text)).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.text = '';
        if (res?.amount === 0) {
          this.showStatus('บันทึกแล้ว', 'แต่ระบบไม่พบจำนวนเงินในข้อความนี้', '⚠️');
        }
      },
      error: (err) => {
        this.isLoading = false;

        const errorMessage = err.error?.message || err.message;
        const status = err.status;

        console.log('Error Status:', status);
        console.log('Error Message:', errorMessage);

        if (errorMessage === 'AI_COULD_NOT_UNDERSTAND') {
          this.showStatus('อ่านไม่ออก', 'รบกวนพิมพ์ใหม่อีกครั้ง เช่น "ข้าวผัด 50" นะครับ', '🤔');
        } else if (status === 429) {
          this.showStatus('โควตาเต็ม', 'ตอนนี้ AI ยุ่งมาก รบกวนรอสักครู่ครับ', '⏳');
        } else if (status === 500) {
          this.showStatus('ระบบขัดข้อง', 'AI มึนกับข้อความนี้ หรือระบบมีปัญหาครับ', '🤖');
        } else {
          this.showStatus('เกิดข้อผิดพลาด', 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้', '❌');
        }
      },
    });
  }

  showStatus(title: string, message: string, icon: string) {
    this.statusData = { title, message, icon };
    this.cdr.detectChanges();
    this.statusDialog.nativeElement.showModal();
  }
}
