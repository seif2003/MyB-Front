import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <section class="landing">
      <div class="landing-inner fade-in">
        <p class="landing-kicker">MYB e-Banking</p>
        <h1>{{ 'app.tagline' | translate }}</h1>
        <p>
          Comptes, cartes, virements et supervision admin, dans une seule plateforme.
        </p>
        <div class="landing-actions">
          <a class="btn btn-primary" routerLink="/login">{{ 'auth.login' | translate }}</a>
          <a class="btn btn-secondary" [routerLink]="['/login']" [queryParams]="{ mode: 'register' }">
            Creer un compte
          </a>
        </div>
      </div>
    </section>
  `
})
export class LandingPageComponent {}
