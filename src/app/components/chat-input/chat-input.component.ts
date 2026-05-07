import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
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
