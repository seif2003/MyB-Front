import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);
  const accessToken = auth.accessToken();

  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || req.url.includes('/auth/refresh')) {
        return throwError(() => error);
      }

      return auth.refreshTokens().pipe(
        switchMap((ok) => {
          if (!ok) {
            return throwError(() => error);
          }
          const refreshed = auth.accessToken();
          const retryReq = refreshed
            ? req.clone({ setHeaders: { Authorization: `Bearer ${refreshed}` } })
            : req;
          return next(retryReq);
        })
      );
    })
  );
};
