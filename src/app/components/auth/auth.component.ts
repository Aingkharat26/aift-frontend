import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {
  SicCardComponent,
  SicInputComponent,
  SicInputPasswordComponent,
  SicButtonComponent,
  SicBadgeComponent,
} from 'sic-ng';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SicCardComponent,
    SicInputComponent,
    SicInputPasswordComponent,
    SicButtonComponent,
    SicBadgeComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  isRegisterMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  errorDetail = signal<string>('');
  showErrorDetail = signal<boolean>(false);
  successMessage = signal<string>('');
  returnUrl = signal<string>('/');

  // Form Models
  username = '';
  password = '';
  confirmPassword = '';

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const returnUrlParam = params.get('returnUrl');
      if (returnUrlParam && returnUrlParam !== '/login') {
        this.returnUrl.set(returnUrlParam);
      }
      this.cdr.detectChanges();
    });
  }

  switchMode(isRegister: boolean) {
    this.isRegisterMode.set(isRegister);
    this.errorMessage.set('');
    this.errorDetail.set('');
    this.showErrorDetail.set(false);
    this.successMessage.set('');
    this.cdr.detectChanges();
  }

  toggleErrorDetail() {
    this.showErrorDetail.update((v) => !v);
    this.cdr.detectChanges();
  }

  onSubmit() {
    this.errorMessage.set('');
    this.errorDetail.set('');
    this.showErrorDetail.set(false);
    this.successMessage.set('');

    const u = this.username.trim();
    const p = this.password;

    if (!u) {
      this.errorMessage.set('กรุณากรอก Username');
      this.cdr.detectChanges();
      return;
    }

    if (u.length < 3) {
      this.errorMessage.set('Username ต้องมีความยาวอย่างน้อย 3 ตัวอักษร');
      this.cdr.detectChanges();
      return;
    }

    if (!p) {
      this.errorMessage.set('กรุณากรอกรหัสผ่าน');
      this.cdr.detectChanges();
      return;
    }

    if (p.length < 4) {
      this.errorMessage.set('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      this.cdr.detectChanges();
      return;
    }

    if (this.isRegisterMode()) {
      if (p !== this.confirmPassword) {
        this.errorMessage.set('รหัสผ่านยืนยันไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
        this.cdr.detectChanges();
        return;
      }

      this.isLoading.set(true);
      this.cdr.detectChanges();

      this.authService
        .register({
          username: u,
          password: p,
          displayName: u,
        })
        .pipe(
          finalize(() => {
            this.isLoading.set(false);
            this.cdr.detectChanges();
          }),
        )
        .subscribe({
          next: () => {
            this.navigateAfterAuth();
          },
          error: (err) => {
            const parsed = this.parseAuthError(err, 'register');
            this.errorMessage.set(parsed.message);
            this.errorDetail.set(parsed.detail);
            this.cdr.detectChanges();
          },
        });
    } else {
      this.isLoading.set(true);
      this.cdr.detectChanges();

      this.authService
        .login({
          username: u,
          password: p,
        })
        .pipe(
          finalize(() => {
            this.isLoading.set(false);
            this.cdr.detectChanges();
          }),
        )
        .subscribe({
          next: () => {
            this.navigateAfterAuth();
          },
          error: (err) => {
            const parsed = this.parseAuthError(err, 'login');
            this.errorMessage.set(parsed.message);
            this.errorDetail.set(parsed.detail);
            this.cdr.detectChanges();
          },
        });
    }
  }

  private parseAuthError(
    err: any,
    mode: 'login' | 'register',
  ): { message: string; detail: string } {
    console.error(`[Auth] ${mode} error:`, err);

    // Timeout
    if (err.name === 'TimeoutError') {
      return {
        message: 'การเชื่อมต่อหมดเวลา (Timeout 20 วินาที)',
        detail: `เซิร์ฟเวอร์ Backend ตอบสนองช้าเกินกำหนด (หากรันบน Render Free Tier เซิร์ฟเวอร์อาจกำลังบูต Cold Start)\nปลายทาง: ${this.authService.currentApiUrl}/${mode}`,
      };
    }

    // Status 0: Network Error / CORS / Backend unreachable / Mixed content
    if (err.status === 0) {
      const isHttps =
        typeof window !== 'undefined' &&
        window.location.protocol === 'https:';
      const targetApi = this.authService.currentApiUrl;
      const isMixedContent = isHttps && targetApi.startsWith('http://');

      let detail = `ปลายทางที่เรียก: ${targetApi}/${mode}`;
      if (isMixedContent) {
        detail += `\n⚠️ สาเหตุ: เบราว์เซอร์บล็อก Mixed Content เนื่องจากหน้าเว็บเปิดด้วย HTTPS แต่ Backend URL เป็น HTTP`;
      } else {
        detail += `\nสาเหตุที่เป็นไปได้:\n1. เซิร์ฟเวอร์ Backend ยังไม่เปิด หรือกำลังเริ่มต้นระบบ (Cold Start)\n2. ไม่สามารถเข้าถึงอินเทอร์เน็ตได้\n3. ติดปัญหา CORS Policy ที่ Backend`;
      }

      return {
        message: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ Backend ได้ (Network Error)',
        detail,
      };
    }

    // 401 Unauthorized
    if (err.status === 401) {
      return {
        message: 'ชื่อผู้ใช้ (Username) หรือรหัสผ่านไม่ถูกต้อง',
        detail:
          err.error?.message ||
          'Status: 401 Unauthorized (รหัสผ่านไม่ตรงกับฐานข้อมูล)',
      };
    }

    // 400 Bad Request
    if (err.status === 400) {
      return {
        message:
          err.error?.message || 'ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
        detail: `Status: 400 Bad Request`,
      };
    }

    // 404 Not Found
    if (err.status === 404) {
      return {
        message: 'ไม่พบบริการเข้าสู่ระบบ (404 Not Found)',
        detail: `Endpoint ไม่ถูกต้อง: ${this.authService.currentApiUrl}/${mode}`,
      };
    }

    // 409 Conflict
    if (err.status === 409) {
      return {
        message: `Username "${this.username.trim()}" นี้มีอยู่ในระบบแล้ว กรุณาเลือกชื่ออื่น`,
        detail: `Status: 409 Conflict (Duplicate username)`,
      };
    }

    // 500 Internal Server Error
    if (err.status === 500) {
      return {
        message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ (500 Internal Server Error)',
        detail:
          err.error?.message || 'โปรดตรวจสอบ Log ของเซิร์ฟเวอร์ Backend',
      };
    }

    // 502 / 503 / 504 Bad Gateway / Service Unavailable
    if (err.status === 502 || err.status === 503 || err.status === 504) {
      return {
        message:
          'เซิร์ฟเวอร์ปลายทางยังไม่พร้อมให้บริการหรือกำลังเริ่มต้นระบบ (Gateway Timeout)',
        detail: `Status: ${err.status} - หากเป็น Render Free Tier โปรดรอประมาณ 1 นาทีแล้วลองใหม่อีกครั้ง`,
      };
    }

    // Fallback error
    return {
      message:
        err.error?.message ||
        'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง',
      detail: `Status: ${err.status || 'unknown'}\nMessage: ${err.message || 'Unknown error'}`,
    };
  }

  private navigateAfterAuth() {
    const target = this.returnUrl() || '/';
    this.router.navigateByUrl(target);
  }
}

