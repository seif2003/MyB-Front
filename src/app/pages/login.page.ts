import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <section class="auth-shell fade-in">
      <div class="card auth-card">
        <h2>{{ mode() === 'register' ? 'Creer votre compte MYB' : ('auth.welcome' | translate) }}</h2>
        <p class="auth-subtitle">{{ 'app.tagline' | translate }}</p>

        <form [formGroup]="loginForm" (ngSubmit)="submitLogin()" *ngIf="mode() === 'login'" class="form-grid" novalidate>
          <label>
            {{ 'auth.email' | translate }}
            <input
              class="input"
              [class.input-invalid]="showFieldError(loginForm.controls.email)"
              formControlName="email"
              type="email"
              autocomplete="email"
            />
            <small *ngIf="showFieldError(loginForm.controls.email)" class="field-error">
              Email invalide.
            </small>
          </label>
          <label>
            {{ 'auth.password' | translate }}
            <input
              class="input"
              [class.input-invalid]="showFieldError(loginForm.controls.password)"
              formControlName="password"
              type="password"
              autocomplete="current-password"
            />
            <small *ngIf="showFieldError(loginForm.controls.password)" class="field-error">
              8 caracteres minimum.
            </small>
          </label>
          <div class="auth-actions">
            <button class="btn btn-primary" type="submit" [disabled]="loading()">
              {{ 'auth.login' | translate }}
            </button>
            <button class="btn btn-secondary" type="button" (click)="setMode('register')">
              Creer un compte
            </button>
          </div>
        </form>

        <form [formGroup]="registerForm" (ngSubmit)="submitRegister()" *ngIf="mode() === 'register'" class="form-grid" novalidate>
          <label>
            Prenom
            <input
              class="input"
              [class.input-invalid]="showFieldError(registerForm.controls.firstName)"
              formControlName="firstName"
              type="text"
              autocomplete="given-name"
            />
            <small *ngIf="showFieldError(registerForm.controls.firstName)" class="field-error">
              Prenom requis.
            </small>
          </label>
          <label>
            Nom
            <input
              class="input"
              [class.input-invalid]="showFieldError(registerForm.controls.lastName)"
              formControlName="lastName"
              type="text"
              autocomplete="family-name"
            />
            <small *ngIf="showFieldError(registerForm.controls.lastName)" class="field-error">
              Nom requis.
            </small>
          </label>
          <label>
            {{ 'auth.email' | translate }}
            <input
              class="input"
              [class.input-invalid]="showFieldError(registerForm.controls.email)"
              formControlName="email"
              type="email"
              autocomplete="email"
            />
            <small *ngIf="showFieldError(registerForm.controls.email)" class="field-error">
              Email invalide.
            </small>
          </label>
          <label>
            {{ 'auth.password' | translate }}
            <input
              class="input"
              [class.input-invalid]="showFieldError(registerForm.controls.password)"
              formControlName="password"
              type="password"
              autocomplete="new-password"
            />
            <small *ngIf="showFieldError(registerForm.controls.password)" class="field-error">
              8 caracteres minimum.
            </small>
          </label>
          <label>
            Confirmation
            <input
              class="input"
              [class.input-invalid]="showFieldError(registerForm.controls.confirmPassword)"
              formControlName="confirmPassword"
              type="password"
              autocomplete="new-password"
            />
            <small *ngIf="showFieldError(registerForm.controls.confirmPassword)" class="field-error">
              Confirmation requise.
            </small>
          </label>
          <label>
            Langue
            <select class="input" formControlName="locale">
              <option value="fr">Francais</option>
              <option value="en">English</option>
            </select>
          </label>
          <div class="auth-actions">
            <button class="btn btn-primary" type="submit" [disabled]="loading()">
              Ouvrir mon compte
            </button>
            <button class="btn btn-secondary" type="button" (click)="setMode('login')">
              Retour connexion
            </button>
          </div>
        </form>

        <form [formGroup]="otpForm" (ngSubmit)="submitOtp()" *ngIf="mode() === 'otp'" class="form-grid" novalidate>
          <label>
            {{ 'auth.otp' | translate }}
            <input
              class="input"
              [class.input-invalid]="showFieldError(otpForm.controls.code)"
              formControlName="code"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
            />
            <small *ngIf="showFieldError(otpForm.controls.code)" class="field-error">
              Code requis.
            </small>
          </label>
          <p *ngIf="previewCode()" class="auth-note">
            Dev code: <strong>{{ previewCode() }}</strong>
          </p>
          <div class="auth-actions">
            <button class="btn btn-secondary" type="button" (click)="setMode('login')">Retour</button>
            <button class="btn btn-primary" type="submit" [disabled]="loading()">
              {{ 'auth.verify' | translate }}
            </button>
          </div>
        </form>

        <p *ngIf="info()" class="auth-success">{{ info() }}</p>
        <p *ngIf="error()" class="auth-error">{{ error() }}</p>
      </div>
    </section>
  `
})
export class LoginPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  readonly mode = signal<'login' | 'register' | 'otp'>('login');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly info = signal<string | null>(null);
  readonly previewCode = signal<string | null>(null);

  private challengeId: string | null = null;

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  readonly registerForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    locale: ['fr', [Validators.required]]
  });

  readonly otpForm = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(4)]]
  });

  constructor(private readonly auth: AuthService) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      if (params.get('mode') === 'register') {
        this.setMode('register');
      }
    });
  }

  setMode(next: 'login' | 'register' | 'otp') {
    this.mode.set(next);
    this.error.set(null);
    this.info.set(null);
    if (next !== 'otp') {
      this.challengeId = null;
      this.previewCode.set(null);
      this.otpForm.reset();
    }
  }

  showFieldError(control: AbstractControl) {
    return control.invalid && (control.touched || control.dirty);
  }

  submitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.error.set("Veuillez saisir un email valide et un mot de passe d'au moins 8 caracteres.");
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.info.set(null);
    const { email, password } = this.loginForm.getRawValue();

    this.auth.login(email, password).subscribe({
      next: (result) => {
        this.challengeId = result.challengeId;
        this.previewCode.set(result.previewCode || null);
        this.mode.set('otp');
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.status === 403
            ? 'Votre compte attend une activation administrateur.'
            : 'Identifiants invalides'
        );
        this.loading.set(false);
      }
    });
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.error.set('Veuillez completer tous les champs du compte.');
      return;
    }

    const value = this.registerForm.getRawValue();
    if (value.password !== value.confirmPassword) {
      this.error.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.info.set(null);

    this.auth
      .register({
        email: value.email,
        password: value.password,
        firstName: value.firstName,
        lastName: value.lastName,
        locale: value.locale as 'fr' | 'en'
      })
      .subscribe({
        next: () => {
          this.loginForm.patchValue({ email: value.email, password: value.password });
          this.info.set('Compte cree. Un administrateur doit maintenant activer votre acces.');
          this.mode.set('login');
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Impossible de creer ce compte.');
          this.loading.set(false);
        }
      });
  }

  submitOtp() {
    if (this.otpForm.invalid || !this.challengeId) {
      this.otpForm.markAllAsTouched();
      this.error.set('Veuillez saisir le code OTP.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.info.set(null);
    const { code } = this.otpForm.getRawValue();

    this.auth.verifyOtp(this.challengeId, code).subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Code incorrect');
        this.loading.set(false);
      }
    });
  }
}
