import { Component, OnInit, effect, signal, computed, untracked } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { AuthService } from '../core/auth.service';
import { ThemeService } from '../core/theme.service';
import { I18nService } from '../core/i18n.service';
import { RealtimeService } from '../core/realtime.service';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TranslateModule, HlmButtonModule],
  template: `
    <div class="app-shell fade-in">
      <div class="sidebar-overlay" [class.open]="sidebarOpen()" (click)="closeSidebar()"></div>
      <aside class="sidebar" [class.open]="sidebarOpen()">
        <div class="brand">
          <span>MYB</span>
        </div>
        <nav class="nav">
          <a routerLink="/app/dashboard" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.dashboard' | translate }}</a>
          <a routerLink="/app/accounts" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.accounts' | translate }}</a>
          <a routerLink="/app/transfers" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.transfers' | translate }}</a>
          <a routerLink="/app/cards" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.cards' | translate }}</a>
          <a routerLink="/app/analytics" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.analytics' | translate }}</a>
          <a routerLink="/app/profile" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.profile' | translate }}</a>
          <a *ngIf="canAccessAdmin()" routerLink="/admin" routerLinkActive="active" (click)="closeSidebar()">{{ 'nav.admin' | translate }}</a>
        </nav>
      </aside>
      <section class="content-area">
        <header class="topbar">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="burger-btn" (click)="toggleSidebar()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div>
              <strong>{{ (auth.user()?.firstName || 'User') }}</strong>
              <div style="font-size: 0.85rem; color: var(--ink-500);">{{ auth.user()?.email }}</div>
            </div>
          </div>
          <div class="actions">
            
            <div class="notifications-dropdown-container">
              <button class="bell-btn" (click)="toggleNotifications($event)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <span class="badge" *ngIf="unreadCount() > 0">{{ unreadCount() > 9 ? '9+' : unreadCount() }}</span>
              </button>
              
              <div class="notifications-dropdown" *ngIf="notificationsOpen()">
                <div class="notifications-header">
                  <span>{{ 'nav.notifications' | translate }}</span>
                  <button (click)="markAllRead()" *ngIf="unreadCount() > 0">Marquer lu</button>
                </div>
                <div class="notifications-body">
                  <div *ngIf="notifications().length === 0" class="no-notifications">
                    Aucune notification
                  </div>
                  <div class="notification-item" 
                       *ngFor="let n of notifications()" 
                       [class.unread]="!n.read"
                       (click)="markRead(n.id)">
                    <div class="title">{{ n.title }}</div>
                    <div class="msg">{{ n.message }}</div>
                    <div class="date">{{ n.createdAt | date:'short' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <button hlmBtn variant="outline" (click)="setLang('fr')" class="hidden-mobile">FR</button>
            <button hlmBtn variant="outline" (click)="setLang('en')" class="hidden-mobile">EN</button>
            <button hlmBtn variant="outline" (click)="theme.toggle()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            </button>
            <button hlmBtn variant="secondary" (click)="logout()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </button>
          </div>
        </header>
        <router-outlet></router-outlet>
      </section>
    </div>
  `,
  styles: [`
    .hidden-mobile {
      display: inline-flex;
    }
    @media (max-width: 640px) {
      .hidden-mobile {
        display: none !important;
      }
    }
  `]
})
export class ClientLayoutComponent implements OnInit {
  sidebarOpen = signal(false);
  notificationsOpen = signal(false);
  
  readonly notifications = signal<any[]>([]);
  readonly unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  constructor(
    public readonly auth: AuthService,
    public readonly theme: ThemeService,
    private readonly i18n: I18nService,
    private readonly realtime: RealtimeService,
    private readonly api: ApiService,
    private readonly router: Router
  ) {
    effect(() => {
      const live = this.realtime.notifications();
      if (!live.length) {
        return;
      }

      const existing = untracked(() => this.notifications());
      const seen = new Set(existing.map((item) => item.id));
      const merged = [...existing];

      for (const item of live) {
        if (!seen.has(item.id)) {
          merged.unshift(item);
          seen.add(item.id);
        }
      }

      this.notifications.set(merged);
    }, { allowSignalWrites: true });
    
    // Close dropdown on outside click
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notifications-dropdown-container')) {
        this.notificationsOpen.set(false);
      }
    });
  }

  ngOnInit() {
    this.realtime.connect();
    this.loadNotifications();
  }
  
  loadNotifications() {
    this.api.get<{ items: any[] }>('/client/notifications').subscribe({
      next: (res) => {
        // Map the existing unread state, backend might just send the list
        // Assuming read state exists on items. If not, default to false.
        const mapped = res.items.map(n => ({ ...n, read: n.read || false }));
        this.notifications.set(mapped);
      },
      error: () => {}
    });
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.notificationsOpen.set(!this.notificationsOpen());
  }

  markRead(id: string) {
    this.api.post(`/client/notifications/${id}/read`, {}).subscribe(() => {
      this.notifications.update(nots => 
        nots.map(n => n.id === id ? { ...n, read: true } : n)
      );
    });
  }

  markAllRead() {
    this.api.post('/client/notifications/read-all', {}).subscribe(() => {
      this.notifications.update(nots => 
        nots.map(n => ({ ...n, read: true }))
      );
    });
  }

  setLang(lang: 'fr' | 'en') {
    this.i18n.use(lang);
  }

  logout() {
    this.auth.logout().subscribe();
  }

  canAccessAdmin() {
    const user = this.auth.user();
    return Boolean(user && user.roles.some((role) => role !== 'CLIENT'));
  }
}
