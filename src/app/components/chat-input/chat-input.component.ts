import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { IncomeService } from '../../services/income.service';
import { SicButtonComponent, SicDialogComponent } from 'sic-ng';

export interface BatchItem {
  item: string;
  amount: number;
  category: string;
}

export type StatusType = 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SicButtonComponent,
    SicDialogComponent,
  ],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css',
})
export class ChatInputComponent implements OnInit, OnDestroy {
  text = '';
  incomeText = '';
  isLoading = false;
  isIncomeLoading = false;
  isScanning = false;
  activeTab: 'expense' | 'income' = 'expense';

  // Voice-to-Text State
  isListening = signal<boolean>(false);
  speechSupported = signal<boolean>(false);
  listeningTarget: 'expense' | 'income' = 'expense';
  private recognition: any = null;

  // Batch Multi-Item Preview State
  showBatchModal = signal<boolean>(false);
  batchItems = signal<BatchItem[]>([]);
  isBatchSaving = signal<boolean>(false);

  // Status Modal State
  showStatusModal = signal<boolean>(false);
  statusData: { title: string; message: string; type: StatusType } = {
    title: '',
    message: '',
    type: 'info',
  };

  readonly availableCategories = [
    'อาหาร',
    'เครื่องดื่ม',
    'เดินทาง',
    'ช้อปปิ้ง',
    'บันเทิง',
    'สุขภาพ',
    'บิล',
    'สัตว์เลี้ยง',
    'อื่นๆ',
  ];

  private expenseService = inject(ExpenseService);
  private incomeService = inject(IncomeService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('receiptInput') receiptInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.initSpeechRecognition();
  }

  ngOnDestroy() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
    }
  }

  setTab(tab: 'expense' | 'income') {
    this.activeTab = tab;
    if (this.isListening() && this.listeningTarget !== tab) {
      this.stopListening();
    }
  }

  private initSpeechRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.speechSupported.set(true);
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'th-TH';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {
          this.isListening.set(true);
          this.cdr.detectChanges();
        };

        this.recognition.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            if (this.listeningTarget === 'expense') {
              this.text = this.text
                ? `${this.text} ${finalTranscript}`.trim()
                : finalTranscript.trim();
            } else {
              this.incomeText = this.incomeText
                ? `${this.incomeText} ${finalTranscript}`.trim()
                : finalTranscript.trim();
            }
            this.cdr.detectChanges();
          }
        };

        this.recognition.onerror = (event: any) => {
          this.isListening.set(false);
          if (event.error === 'not-allowed') {
            this.showStatus(
              'ไมโครโฟนถูกปิดกั้น',
              'กรุณากดอนุญาตสิทธิ์การใช้งานไมโครโฟนในเบราว์เซอร์ เพื่อใช้งานระบบบันทึกด้วยเสียง',
              'warning',
            );
          } else if (event.error !== 'no-speech') {
            console.warn('SpeechRecognition error:', event.error);
          }
          this.cdr.detectChanges();
        };

        this.recognition.onend = () => {
          this.isListening.set(false);
          this.cdr.detectChanges();
        };
      } catch (e) {
        console.error('Failed to initialize speech recognition:', e);
        this.speechSupported.set(false);
      }
    } else {
      this.speechSupported.set(false);
    }
  }

  toggleListening(target: 'expense' | 'income' = 'expense') {
    if (!this.speechSupported()) {
      this.showStatus(
        'เบราว์เซอร์ไม่รองรับเสียง',
        'เบราว์เซอร์นี้ยังไม่รองรับระบบแปลงเสียงเป็นข้อความ แนะนำให้ใช้งานผ่าน Google Chrome, Microsoft Edge หรือ Safari',
        'info',
      );
      return;
    }

    if (this.isListening()) {
      this.stopListening();
    } else {
      this.listeningTarget = target;
      try {
        this.recognition.start();
      } catch (e) {
        console.error('Speech recognition start failed:', e);
      }
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    this.isListening.set(false);
  }

  private fixThaiKeyboard(val: string): string {
    if (!val) return '';
    // Fix only mistyped Thai number row keys when used as a pure number token (e.g. "ถจ" -> "50", "คจจ" -> "800")
    // NEVER convert consonants inside words like "ข้าว" or "กาชา" or "ค่าน้ำ" or "ต้มยำ"
    // And NEVER map 'ข' or 'ช' because they are Thai consonants matching '-' and '=' keys, NOT digits.
    const thaiNumMap: Record<string, string> = {
      'ๅ': '1',
      'ภ': '4',
      'ถ': '5',
      'ุ': '6',
      'ึ': '7',
      'ค': '8',
      'ต': '9',
      'จ': '0',
    };

    return val.replace(/(^|\s)([ๅภถุึคตจ]+)(?=\s|$|บาท|บ\.)/g, (match, prefix, numToken) => {
      const converted = numToken
        .split('')
        .map((c: string) => thaiNumMap[c] || c)
        .join('');
      return prefix + converted;
    });
  }

  onSubmit() {
    if (!this.text.trim()) return;
    this.isLoading = true;

    this.expenseService.processChat(this.fixThaiKeyboard(this.text)).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const data = res?.data || res;

        // Multi-item Batch Detected -> Show Preview Dialog
        if (data?.isBatch && Array.isArray(data.items) && data.items.length > 1) {
          this.batchItems.set(
            data.items.map((i: any) => ({
              item: i.item || 'รายจ่าย',
              amount: Number(i.amount) || 0,
              category: i.category || 'อื่นๆ',
            })),
          );
          this.showBatchModal.set(true);
          this.text = '';
          return;
        }

        // Single item processed
        this.text = '';
        if (data?.amount === 0) {
          this.showStatus(
            'บันทึกเรียบร้อย',
            'แต่ระบบไม่พบจำนวนเงินในข้อความนี้ สามารถกดแก้ไขยอดในรายการวันนี้ได้ครับ',
            'warning',
          );
        } else {
          this.showStatus('บันทึกเรียบร้อย', 'เพิ่มรายการรายจ่ายสำเร็จ', 'success');
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message || err.message;
        const status = err.status;

        if (errorMessage === 'AI_COULD_NOT_UNDERSTAND') {
          this.showStatus(
            'อ่านไม่ออก',
            'รบกวนพิมพ์ใหม่อีกครั้ง เช่น "ข้าวผัด 50" หรือ "ข้าว 50 กาแฟ 40" นะครับ',
            'warning',
          );
        } else if (status === 429) {
          this.showStatus(
            'โควตาเต็ม',
            'ตอนนี้ AI ยุ่งมาก รบกวนรอสักครู่แล้วลองใหม่ครับ',
            'warning',
          );
        } else if (status === 500) {
          this.showStatus(
            'ระบบขัดข้อง',
            'AI ไม่สามารถประมวลผลข้อความนี้ได้ หรือระบบขัดข้องชั่วคราว',
            'error',
          );
        } else {
          this.showStatus(
            'เกิดข้อผิดพลาด',
            'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง',
            'error',
          );
        }
      },
    });
  }

  // Batch Preview Dialog Actions
  addBatchItem() {
    this.batchItems.update((items) => [
      ...items,
      { item: '', amount: 0, category: 'อื่นๆ' },
    ]);
  }

  removeBatchItem(index: number) {
    this.batchItems.update((items) => items.filter((_, i) => i !== index));
    if (this.batchItems().length === 0) {
      this.showBatchModal.set(false);
    }
  }

  getBatchTotal(): number {
    return this.batchItems().reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );
  }

  confirmSaveBatch() {
    const validItems = this.batchItems().filter(
      (i) => i.item.trim().length > 0 && Number(i.amount) > 0,
    );

    if (validItems.length === 0) {
      this.showStatus(
        'ข้อมูลไม่ครบถ้วน',
        'กรุณาระบุชื่อรายการและจำนวนเงินที่มากกว่า 0 อย่างน้อย 1 รายการ',
        'warning',
      );
      return;
    }

    this.isBatchSaving.set(true);
    this.expenseService.saveBatch(validItems).subscribe({
      next: (res) => {
        this.isBatchSaving.set(false);
        this.showBatchModal.set(false);
        const count = res?.count || validItems.length;
        this.showStatus(
          'บันทึกสำเร็จ',
          `เพิ่มรายการรายจ่ายทั้งหมด ${count} รายการ เรียบร้อยแล้ว`,
          'success',
        );
        this.batchItems.set([]);
      },
      error: (err) => {
        this.isBatchSaving.set(false);
        this.showStatus(
          'เกิดข้อผิดพลาด',
          'ไม่สามารถบันทึกชุดรายการนี้ได้ กรุณาลองใหม่อีกครั้ง',
          'error',
        );
      },
    });
  }

  closeBatchModal() {
    this.showBatchModal.set(false);
    this.batchItems.set([]);
  }

  onReceiptSelected(event: any) {
    const file = event.target?.files?.[0];
    if (!file) return;
    this.scanReceipt(file);
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
            this.showStatus(
              'อ่านได้บางส่วน',
              'ไม่พบยอดรวมในใบเสร็จนี้ สามารถแก้ไขในรายการวันนี้ได้ครับ',
              'warning',
            );
          } else {
            this.showStatus(
              'สแกนใบเสร็จสำเร็จ',
              `บันทึก "${saved.item}" จำนวน ${saved.amount} บาท หมวด ${saved.category}`,
              'success',
            );
          }
        },
        error: (err) => {
          this.isScanning = false;
          const errorMessage = err.error?.message || err.message;
          const status = err.status;

          if (errorMessage === 'AI_COULD_NOT_UNDERSTAND') {
            this.showStatus(
              'อ่านไม่ออก',
              'ไม่พบข้อมูลที่ชัดเจนในรูปนี้ กรุณาถ่ายภาพใบเสร็จให้ชัดเจนขึ้นแล้วลองใหม่ครับ',
              'warning',
            );
          } else if (status === 413) {
            this.showStatus(
              'รูปใหญ่เกินไป',
              'กรุณาใช้รูปถ่ายที่มีขนาดเล็กลง (ไม่เกิน ~10MB)',
              'warning',
            );
          } else if (status === 429) {
            this.showStatus(
              'โควตาเต็ม',
              'ตอนนี้ AI ยุ่งมาก รบกวนรอสักครู่แล้วลองใหม่ครับ',
              'warning',
            );
          } else {
            this.showStatus(
              'เกิดข้อผิดพลาด',
              'ไม่สามารถอ่านใบเสร็จได้ กรุณาลองใหม่อีกครั้ง',
              'error',
            );
          }
        },
      });
    };
    reader.onerror = () => {
      this.isScanning = false;
      this.showStatus('เกิดข้อผิดพลาด', 'ไม่สามารถอ่านไฟล์รูปได้', 'error');
    };
    reader.readAsDataURL(file);
  }

  onAddIncome() {
    if (!this.incomeText.trim()) return;
    this.isIncomeLoading = true;

    this.incomeService
      .processChat(this.fixThaiKeyboard(this.incomeText))
      .subscribe({
        next: (res: any) => {
          this.isIncomeLoading = false;
          this.incomeText = '';

          this.expenseService.refreshDailyLogs();
          this.expenseService.notifyDataChanged();

          if (res?.amount === 0) {
            this.showStatus(
              'บันทึกเรียบร้อย',
              'แต่ระบบไม่พบจำนวนเงินในข้อความนี้ สามารถแก้ไขในรายการวันนี้ได้ครับ',
              'warning',
            );
          } else {
            this.showStatus('บันทึกเรียบร้อย', 'เพิ่มรายรับเรียบร้อยแล้ว', 'success');
          }
        },
        error: (err) => {
          this.isIncomeLoading = false;
          const errorMessage = err.error?.message || err.message;
          const status = err.status;

          if (errorMessage === 'AI_COULD_NOT_UNDERSTAND') {
            this.showStatus(
              'อ่านไม่ออก',
              'รบกวนพิมพ์ใหม่อีกครั้ง เช่น "เงินเดือน 50000" หรือ "ขายของ 800" นะครับ',
              'warning',
            );
          } else if (status === 429) {
            this.showStatus(
              'โควตาเต็ม',
              'ตอนนี้ AI ยุ่งมาก รบกวนรอสักครู่แล้วลองใหม่ครับ',
              'warning',
            );
          } else {
            this.showStatus('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกรายรับได้', 'error');
          }
        },
      });
  }

  showStatus(title: string, message: string, type: StatusType) {
    this.statusData = { title, message, type };
    this.cdr.detectChanges();
    this.showStatusModal.set(true);
  }
}
