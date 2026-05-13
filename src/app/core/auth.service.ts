import { Injectable, computed, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthChallenge, AuthTokens, UserProfile } from './models';

const ACCESS_KEY = 'myb_access_token';
const REFRESH_KEY = 'myb_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly _accessToken = signal<string | null>(null);
  private readonly _refreshToken = signal<string | null>(null);
  private readonly _user = signal<UserProfile | null>(null);

  readonly accessToken = computed(() => this._accessToken());
  readonly refreshToken = computed(() => this._refreshToken());
  readonly user = computed(() => this._user());
  readonly isAuthenticated = computed(() => Boolean(this._accessToken()));

  private _profileRequest$?: import('rxjs').Observable<boolean>;

  constructor() {
    const accessToken = localStorage.getItem(ACCESS_KEY);
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (accessToken && refreshToken) {
      this._accessToken.set(accessToken);
      this._refreshToken.set(refreshToken);
      this.loadProfile().subscribe();
    }
  }

  login(email: string, password: string) {
    return this.api.post<AuthChallenge>('/auth/login', { email, password });
  }

  register(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    locale: 'fr' | 'en';
  }) {
    return this.api.post<{ user: { id: string; email: string } }>('/auth/register', payload);
  }

  verifyOtp(challengeId: string, code: string) {
    return this.api.post<AuthTokens>('/auth/verify-2fa', { challengeId, code }).pipe(
      tap((tokens) => this.storeTokens(tokens)),
      switchMap(() => this.loadProfile()),
      tap((loaded) => {
        if (loaded) {
          this.navigateAfterLogin();
        }
      })
    );
  }

  refreshTokens() {
    const refreshToken = this._refreshToken();
    if (!refreshToken) {
      return of(false);
    }

    return this.api.post<AuthTokens>('/auth/refresh', { refreshToken }).pipe(
      tap((tokens) => this.storeTokens(tokens)),
      map(() => true),
      catchError(() => {
        this.clearSession();
        return of(false);
      })
    );
  }

  logout() {
    const refreshToken = this._refreshToken();
    if (!refreshToken) {
      this.clearSession();
      this.router.navigate(['/login']);
      return of(null);
    }

    return this.api.post<void>('/auth/logout', { refreshToken }).pipe(
      catchError(() => of(null)),
      tap(() => {
        this.clearSession();
        this.router.navigate(['/login']);
      })
    );
  }

  loadProfile() {
    if (this._profileRequest$) {
      return this._profileRequest$;
    }

    this._profileRequest$ = this.api.get<{ user: UserProfile }>('/me').pipe(
      tap((response) => {
        this._user.set(response.user);
        this._profileRequest$ = undefined;
      }),
      map(() => true),
      catchError(() => {
        this._profileRequest$ = undefined;
        return of(false);
      }),
      shareReplay(1)
    );

    return this._profileRequest$;
  }

  private storeTokens(tokens: AuthTokens) {
    this._accessToken.set(tokens.accessToken);
    this._refreshToken.set(tokens.refreshToken);
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  }

  private navigateAfterLogin() {
    const user = this._user();
    if (!user) {
      return;
    }

    const hasAdminRole = user.roles.some((role) => role !== 'CLIENT');
    this.router.navigate([hasAdminRole ? '/admin/dashboard' : '/app/dashboard']);
  }

  clearSession() {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._user.set(null);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
}
