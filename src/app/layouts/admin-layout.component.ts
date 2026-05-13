import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { AuthService } from '../core/auth.service';
import { ThemeService } from '../core/theme.service';
import { I18nService } from '../core/i18n.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule, HlmButtonModule],
  template: `
    <div class="app-shell fade-in">
      <div class="sidebar-overlay" [class.open]="sidebarOpen()" (click)="closeSidebar()"></div>
      <aside class="sidebar" [class.open]="sidebarOpen()">
        <div class="brand">
          <span>MYB Admin</span>
        </div>
        <nav class="nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.dashboard' | translate }}</a>
          <a routerLink="/admin/users" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.users' | translate }}</a>
          <a routerLink="/admin/accounts" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.accounts_admin' | translate }}</a>
          <a routerLink="/admin/cards" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.cards_admin' | translate }}</a>
          <a routerLink="/admin/transactions" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.transactions' | translate }}</a>
          <a routerLink="/admin/fraud" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.fraud' | translate }}</a>
          <a routerLink="/admin/rbac" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.rbac' | translate }}</a>
          <a routerLink="/admin/audit" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.audit' | translate }}</a>
        </nav>
      </aside>
      <section class="content-area">
        <header class="topbar">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="burger-btn" type="button" (click)="toggleSidebar()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div>
              <strong>{{ auth.user()?.firstName }}</strong>
              <div style="font-size: 0.85rem; color: var(--ink-500);">{{ auth.user()?.email }}</div>
            </div>
          </div>
          <div class="actions">
            <button hlmBtn variant="outline" type="button" (click)="setLang('fr')">FR</button>
            <button hlmBtn variant="outline" type="button" (click)="setLang('en')">EN</button>
            <button hlmBtn variant="outline" type="button" (click)="theme.toggle()">
              {{ theme.theme() === 'dark' ? ('common.light' | translate) : ('common.dark' | translate) }}
            </button>
            <button hlmBtn variant="secondary" type="button" routerLink="/app/dashboard">Client</button>
            <button hlmBtn variant="secondary" type="button" (click)="logout()">{{ 'auth.logout' | translate }}</button>
          </div>
        </header>
        <router-outlet></router-outlet>
      </section>
    </div>
  `
})
export class AdminLayoutComponent {
  readonly sidebarOpen = signal(false);

  constructor(
    public readonly auth: AuthService,
    public readonly theme: ThemeService,
    private readonly i18n: I18nService
  ) {}

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  setLang(lang: 'fr' | 'en') {
    this.i18n.use(lang);
  }

  logout() {
    this.auth.logout().subscribe();
  }
}
