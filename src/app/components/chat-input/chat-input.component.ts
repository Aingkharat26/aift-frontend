import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { IncomeService } from '../../services/income.service';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css',
})
export class ChatInputComponent {
  text = '';
  incomeText = '';
  isLoading = false;
  isIncomeLoading = false;
  isScanning = false;

  private expenseService = inject(ExpenseService);
  private incomeService = inject(IncomeService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('statusDialog') statusDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('receiptInput') receiptInput!: ElementRef<HTMLInputElement>;

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
          this.showStatus('บันทึกเรียบร้อย', 'แต่ระบบไม่พบจำนวนเงินในข้อความนี้', '⚠️');
        } else {
          this.showStatus('บันทึกเรียบร้อย', 'เพิ่มรายการรายจ่ายสำเร็จ', '💸');
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

  onReceiptSelected(event: any) {
    const file = event.target?.files?.[0];
    if (!file) return;
    this.scanReceipt(file);
    // reset เพื่อให้เลือกไฟล์เดิมซ้ำได้
    if (this.receiptInput) {
      this.receiptInput.nativeElement.value = '';
    }
  }

  scanReceipt(file: File) {
    if (this.isScanning || this.isLoading) return;
    this.isScanning = true;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result).split(',')[1] || '';
      const mimeType = file.type || 'image/jpeg';

      this.expenseService.processReceipt(base64, mimeType).subscribe({
        next: (res: any) => {
          this.isScanning = false;
          const saved = res?.data || res;
          if (saved?.amount === 0) {
            this.showStatus('อ่านได้บางส่วน', 'ไม่พบยอดรวมในใบเสร็จนี้', '⚠️');
          } else {
            this.showStatus(
              'สแกนใบเสร็จสำเร็จ',
              `บันทึก "${saved.item}" จำนวน ${saved.amount} บาท หมวด ${saved.category}`,
              '🧾',
            );
          }
        },
        error: (err) => {
          this.isScanning = false;
          const errorMessage = err.error?.message || err.message;
          const status = err.status;

          if (errorMessage === 'AI_COULD_NOT_UNDERSTAND') {
            this.showStatus('อ่านไม่ออก', 'ไม่พบข้อมูลในรูปนี้ ลองถ่ายใบเสร็จให้ชัดแล้วลองใหม่', '🤔');
          } else if (status === 413) {
            this.showStatus('รูปใหญ่เกินไป', 'กรุณาใช้รูปที่มีขนาดเล็กลง (ไม่เกิน ~10MB)', '📏');
          } else if (status === 429) {
            this.showStatus('โควตาเต็ม', 'ตอนนี้ AI ยุ่งมาก รบกวนรอสักครู่ครับ', '⏳');
          } else {
            this.showStatus('เกิดข้อผิดพลาด', 'ไม่สามารถอ่านใบเสร็จได้ ลองใหม่อีกครั้ง', '❌');
          }
        },
      });
    };
    reader.onerror = () => {
      this.isScanning = false;
      this.showStatus('เกิดข้อผิดพลาด', 'ไม่สามารถอ่านไฟล์รูปได้', '❌');
    };
    reader.readAsDataURL(file);
  }

  onAddIncome() {
    if (!this.incomeText.trim()) return;
    this.isIncomeLoading = true;

    this.incomeService.processChat(this.incomeText).subscribe({
      next: (res: any) => {
        this.isIncomeLoading = false;
        this.incomeText = '';

        // Refresh all data
        this.expenseService.refreshDailyLogs();
        this.expenseService.notifyDataChanged();

        if (res?.amount === 0) {
          this.showStatus('บันทึกเรียบร้อย', 'แต่ระบบไม่พบจำนวนเงินในข้อความนี้', '⚠️');
        } else {
          this.showStatus('บันทึกเรียบร้อย', 'เพิ่มรายรับเรียบร้อย', '💰');
        }
      },
      error: (err) => {
        this.isIncomeLoading = false;
        const errorMessage = err.error?.message || err.message;
        const status = err.status;

        if (errorMessage === 'AI_COULD_NOT_UNDERSTAND') {
          this.showStatus(
            'อ่านไม่ออก',
            'รบกวนพิมพ์ใหม่อีกครั้ง เช่น "เงินเดือน 50000" นะครับ',
            '🤔',
          );
        } else if (status === 429) {
          this.showStatus('โควตาเต็ม', 'ตอนนี้ AI ยุ่งมาก รบกวนรอสักครู่ครับ', '⏳');
        } else {
          this.showStatus('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกรายรับได้', '❌');
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
