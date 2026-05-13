import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../core/api.service';
import { RealtimeService } from '../../core/realtime.service';

interface DashboardResponse {
  summary: {
    totalBalance: number;
    accounts: number;
    cards: number;
    pendingTransfers: number;
  };
  accounts: Array<{ id: string; label: string; iban: string; currency: string; balance: number; status: string }>;
  recentTransactions: Array<{ id: string; type: string; amount: number; currency: string; status: string; description?: string }>
}

@Component({
  selector: 'app-client-dashboard-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="page-grid">
      <div class="card">
        <h3>{{ 'dashboard.balance' | translate }}</h3>
        <div class="stats-grid">
          <div class="stat">
            <span>{{ 'dashboard.balance' | translate }}</span>
            <strong>{{ data()?.summary?.totalBalance || 0 | number:'1.2-2' }} EUR</strong>
          </div>
          <div class="stat">
            <span>{{ 'dashboard.accounts' | translate }}</span>
            <strong>{{ data()?.summary?.accounts || 0 }}</strong>
          </div>
          <div class="stat">
            <span>{{ 'dashboard.cards' | translate }}</span>
            <strong>{{ data()?.summary?.cards || 0 }}</strong>
          </div>
          <div class="stat">
            <span>{{ 'dashboard.pendingTransfers' | translate }}</span>
            <strong>{{ data()?.summary?.pendingTransfers || 0 }}</strong>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>{{ 'dashboard.accounts' | translate }}</h3>
        <table class="table" *ngIf="data()?.accounts?.length">
          <thead>
            <tr>
              <th>Label</th>
              <th>IBAN</th>
              <th>{{ 'common.amount' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let account of data()?.accounts">
              <td>{{ account.label }}</td>
              <td>{{ account.iban }}</td>
              <td>{{ account.balance | number:'1.2-2' }} {{ account.currency }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <h3>{{ 'dashboard.recent' | translate }}</h3>
        <table class="table" *ngIf="data()?.recentTransactions?.length">
          <thead>
            <tr>
              <th>Type</th>
              <th>{{ 'common.amount' | translate }}</th>
              <th>{{ 'common.status' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tx of data()?.recentTransactions">
              <td>{{ tx.type }}</td>
              <td>{{ tx.amount | number:'1.2-2' }} {{ tx.currency }}</td>
              <td><span class="pill">{{ tx.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ClientDashboardPageComponent implements OnInit {
  readonly data = signal<DashboardResponse | null>(null);

  constructor(
    private readonly api: ApiService,
    private readonly realtime: RealtimeService
  ) {
    effect(() => {
      const balanceUpdate = this.realtime.balanceUpdate();
      const current = this.data();
      if (!balanceUpdate || !current) {
        return;
      }

      const mergedAccounts = current.accounts.map((account) => {
        const live = balanceUpdate.accounts.find((item) => item.id === account.id);
        if (!live) {
          return account;
        }

        return {
          ...account,
          balance: live.balance,
          status: live.status
        };
      });

      this.data.set({
        ...current,
        summary: {
          ...current.summary,
          totalBalance: balanceUpdate.totalBalance
        },
        accounts: mergedAccounts
      });
    });
  }

  ngOnInit() {
    this.api.get<DashboardResponse>('/client/dashboard').subscribe((response) => this.data.set(response));
  }
}
