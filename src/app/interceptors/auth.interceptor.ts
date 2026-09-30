import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, retry, timer } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    // Auto-retry transient gateway/network errors (e.g. Render waking up from sleep)
    retry({
      count: 2,
      delay: (error, retryCount) => {
        const isTransient = [0, 502, 503, 504].includes(error?.status);
        const isAuthSubmit =
          req.url.includes('/auth/login') || req.url.includes('/auth/register');

        // Only retry transient cold-start / wake-up errors for normal data requests
        if (isTransient && !isAuthSubmit) {
          return timer(retryCount * 2500);
        }
        return throwError(() => error);
      },
    }),
    catchError((err: HttpErrorResponse) => {
      // If 401 on protected operational routes (excluding login, register, and background me check), log out
      if (
        err.status === 401 &&
        !req.url.includes('/auth/login') &&
        !req.url.includes('/auth/register') &&
        !req.url.includes('/auth/me')
      ) {
        authService.logout(router.url);
      }
      return throwError(() => err);
    }),
  );
};
