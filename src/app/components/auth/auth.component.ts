import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isRegisterMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  // Form Models
  username = '';
  password = '';
  confirmPassword = '';
  displayName = '';

  switchMode(isRegister: boolean) {
    this.isRegisterMode.set(isRegister);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.cdr.detectChanges();
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
      this.cdr.detectChanges();

      this.authService
        .register({
          username: u,
          password: p,
          displayName: this.displayName.trim() || u,
        })
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.cdr.detectChanges();
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.isLoading.set(false);
            if (err.status === 409) {
              this.errorMessage.set(
                `Username "${u}" นี้มีอยู่ในระบบแล้ว`,
              );
            } else {
              this.errorMessage.set(
                err.error?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง',
              );
            }
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
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.cdr.detectChanges();
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.isLoading.set(false);
            if (err.status === 401) {
              this.errorMessage.set('Username หรือ รหัสผ่านไม่ถูกต้อง');
            } else {
              this.errorMessage.set(
                err.error?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
              );
            }
            this.cdr.detectChanges();
          },
        });
    }
  }
}
