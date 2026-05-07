import { Component, inject } from '@angular/core';
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
  `,
  styles: [`
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
  `]
})
export class ChatInputComponent {
  text = '';
  isLoading = false;
  private expenseService = inject(ExpenseService);

  onSubmit() {
    if (!this.text.trim()) return;
    this.isLoading = true;
    
    this.expenseService.processChat(this.text).subscribe({
      next: () => {
        this.text = '';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to process chat', err);
        this.isLoading = false;
      }
    });
  }
}
