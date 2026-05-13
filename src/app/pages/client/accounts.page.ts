import { Component, OnInit, effect, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { TranslateModule } from '@ngx-translate/core';
import { RealtimeService } from '../../core/realtime.service';

interface Account {
  id: string;
  label: string;
  iban: string;
  currency: string;
  balance: number;
  status: string;
}

@Component({
  selector: 'app-accounts-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="page-grid">
      <div class="card">
        <h3>{{ 'nav.accounts' | translate }}</h3>
        <table class="table" *ngIf="accounts().length">
          <thead>
            <tr>
              <th>Label</th>
              <th>IBAN</th>
              <th>{{ 'common.amount' | translate }}</th>
              <th>{{ 'common.status' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let account of accounts()" (click)="selectAccount(account)" style="cursor: pointer;">
              <td>{{ account.label }}</td>
              <td>{{ account.iban }}</td>
              <td>{{ account.balance | number:'1.2-2' }} {{ account.currency }}</td>
              <td><span class="pill">{{ account.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card" *ngIf="selectedAccount()">
        <h3>Transactions</h3>
        <table class="table" *ngIf="transactions().length">
          <thead>
            <tr>
              <th>Type</th>
              <th>{{ 'common.amount' | translate }}</th>
              <th>{{ 'common.status' | translate }}</th>
              <th>{{ 'common.date' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tx of transactions()">
              <td>{{ tx.type }}</td>
              <td>{{ tx.amount | number:'1.2-2' }} {{ tx.currency }}</td>
              <td><span class="pill">{{ tx.status }}</span></td>
              <td>{{ tx.createdAt | date:'short' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AccountsPageComponent implements OnInit {
  readonly accounts = signal<Account[]>([]);
  readonly transactions = signal<any[]>([]);
  readonly selectedAccount = signal<Account | null>(null);

  constructor(
    private readonly api: ApiService,
    private readonly realtime: RealtimeService
  ) {
    effect(() => {
      const update = this.realtime.balanceUpdate();
      if (!update) {
        return;
      }

      const current = untracked(() => this.accounts());
      const merged = current.map((account) => {
        const live = update.accounts.find((item) => item.id === account.id);
        if (!live) {
          return account;
        }

        return {
          ...account,
          balance: live.balance,
          status: live.status
        };
      });

      this.accounts.set(merged);
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.api.get<{ accounts: Account[] }>('/client/accounts').subscribe((res) => this.accounts.set(res.accounts));
  }

  selectAccount(account: Account) {
    this.selectedAccount.set(account);
    this.api
      .get<{ items: any[] }>(`/client/accounts/${account.id}/transactions`)
      .subscribe((res) => this.transactions.set(res.items));
  }
}
