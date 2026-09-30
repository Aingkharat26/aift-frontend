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
  successMessage = signal<string>('');
  coldStartNotice = signal<string>('');
  returnUrl = signal<string>('/');

  private coldStartTimer: any = null;

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

  ngOnDestroy() {
    this.clearColdStartTimer();
  }

  switchMode(isRegister: boolean) {
    this.clearColdStartTimer();
    this.isRegisterMode.set(isRegister);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.cdr.detectChanges();
  }

  private startColdStartTimer() {
    this.clearColdStartTimer();
    this.coldStartTimer = setTimeout(() => {
      if (this.isLoading()) {
        this.coldStartNotice.set(
          '⚡ กำลังเชื่อมต่อเซิร์ฟเวอร์ (หากเซิร์ฟเวอร์เพิ่งตื่นจากโหมดสลีป อาจใช้เวลาประมาณ 30-50 วินาที โปรดรอสักครู่)...',
        );
        this.cdr.detectChanges();
      }
    }, 4000);
  }

  private clearColdStartTimer() {
    if (this.coldStartTimer) {
      clearTimeout(this.coldStartTimer);
      this.coldStartTimer = null;
    }
    this.coldStartNotice.set('');
  }

  onSubmit() {
    this.errorMessage.set('');
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
      this.startColdStartTimer();
      this.cdr.detectChanges();

      this.authService
        .register({
          username: u,
          password: p,
          displayName: u,
        })
        .pipe(
          finalize(() => {
            this.clearColdStartTimer();
            this.isLoading.set(false);
            this.cdr.detectChanges();
          }),
        )
        .subscribe({
          next: () => {
            this.navigateAfterAuth();
          },
          error: (err) => {
            const message = this.parseAuthError(err, 'register');
            this.errorMessage.set(message);
            this.cdr.detectChanges();
          },
        });
    } else {
      this.isLoading.set(true);
      this.startColdStartTimer();
      this.cdr.detectChanges();

      this.authService
        .login({
          username: u,
          password: p,
        })
        .pipe(
          finalize(() => {
            this.clearColdStartTimer();
            this.isLoading.set(false);
            this.cdr.detectChanges();
          }),
        )
        .subscribe({
          next: () => {
            this.navigateAfterAuth();
          },
          error: (err) => {
            const message = this.parseAuthError(err, 'login');
            this.errorMessage.set(message);
            this.cdr.detectChanges();
          },
        });
    }
  }

  private parseAuthError(
    err: any,
    mode: 'login' | 'register',
  ): string {
    console.error(`[Auth] ${mode} error:`, err);

    // Timeout
    if (err.name === 'TimeoutError') {
      return 'การเชื่อมต่อหมดเวลา เซิร์ฟเวอร์กำลังเริ่มต้นระบบใหม่ กรุณากดลองอีกครั้ง';
    }

    // Status 0: Network Error / CORS / Backend unreachable
    if (err.status === 0) {
      return 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
    }

    // 401 Unauthorized
    if (err.status === 401) {
      return 'ชื่อผู้ใช้ (Username) หรือรหัสผ่านไม่ถูกต้อง';
    }

    // 400 Bad Request
    if (err.status === 400) {
      return err.error?.message || 'ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
    }

    // 404 Not Found
    if (err.status === 404) {
      return 'ไม่พบบริการเข้าสู่ระบบ (404 Not Found)';
    }

    // 409 Conflict
    if (err.status === 409) {
      return `Username "${this.username.trim()}" นี้มีอยู่ในระบบแล้ว กรุณาเลือกชื่ออื่น`;
    }

    // 500 Internal Server Error
    if (err.status === 500) {
      return 'ระบบขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง';
    }

    // 502 / 503 / 504 Bad Gateway / Service Unavailable
    if (err.status === 502 || err.status === 503 || err.status === 504) {
      return 'เซิร์ฟเวอร์ยังไม่พร้อมให้บริการ โปรดรอสักครู่แล้วลองใหม่';
    }

    // Fallback error
    return (
      err.error?.message ||
      'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง'
    );
  }

  private navigateAfterAuth() {
    const target = this.returnUrl() || '/';
    this.router.navigateByUrl(target);
  }
}

