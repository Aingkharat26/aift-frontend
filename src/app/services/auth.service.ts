import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  displayName: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private tokenKey = 'aift_token';
  private userKey = 'aift_user';

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.restoreSession();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private restoreSession() {
    const token = this.getToken();
    const savedUser = localStorage.getItem(this.userKey);
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        this.currentUser.set(parsed);
        // Verify with backend silently
        this.http.get<User>(`${this.apiUrl}/me`).subscribe({
          next: (user) => {
            this.currentUser.set(user);
            localStorage.setItem(this.userKey, JSON.stringify(user));
          },
          error: () => {
            this.logout(this.router.url, 'session_expired');
          },
        });
      } catch {
        this.logout();
      }
    }
  }

  register(data: {
    username: string;
    password: string;
    displayName?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => {
        this.handleAuthSuccess(res);
      }),
    );
  }

  login(data: {
    username: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        this.handleAuthSuccess(res);
      }),
    );
  }

  private handleAuthSuccess(res: AuthResponse) {
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.userKey, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  logout(returnUrl?: string, reason?: string) {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
    const queryParams: Record<string, string> = {};
    if (returnUrl && returnUrl !== '/login') {
      queryParams['returnUrl'] = returnUrl;
    }
    if (reason) {
      queryParams['reason'] = reason;
    }
    this.router.navigate(['/login'], { queryParams });
  }
}

