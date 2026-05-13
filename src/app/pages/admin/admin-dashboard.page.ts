import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../core/api.service';

interface AdminKpis {
  users: number;
  accounts: number;
  cards: number;
  transactions: number;
  pendingTransfers: number;
  fraudOpen: number;
  totalVolume: number;
}

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="page-grid">
      <div class="card">
        <h3>{{ 'admin.kpi' | translate }}</h3>
        <div class="stats-grid" *ngIf="kpis() as stats">
          <div class="stat">
            <span>{{ 'nav.users' | translate }}</span>
            <strong>{{ stats.users }}</strong>
          </div>
          <div class="stat">
            <span>{{ 'nav.accounts' | translate }}</span>
            <strong>{{ stats.accounts }}</strong>
          </div>
          <div class="stat">
            <span>{{ 'nav.cards' | translate }}</span>
            <strong>{{ stats.cards }}</strong>
          </div>
          <div class="stat">
            <span>{{ 'nav.transactions' | translate }}</span>
            <strong>{{ stats.transactions }}</strong>
          </div>
          <div class="stat">
            <span>{{ 'dashboard.pendingTransfers' | translate }}</span>
            <strong>{{ stats.pendingTransfers }}</strong>
          </div>
          <div class="stat">
            <span>{{ 'nav.fraud' | translate }}</span>
            <strong>{{ stats.fraudOpen }}</strong>
          </div>
          <div class="stat">
            <span>{{ 'admin.totalVolume' | translate }}</span>
            <strong>{{ stats.totalVolume | number: '1.2-2' }} EUR</strong>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardPageComponent implements OnInit {
  readonly kpis = signal<AdminKpis | null>(null);

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<{ kpis: AdminKpis }>('/admin/dashboard').subscribe((response) => {
      this.kpis.set(response.kpis);
    });
  }
}
