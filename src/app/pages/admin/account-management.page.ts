import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../core/api.service';

interface AccountItem {
  id: string;
  userId: string;
  holder: string;
  iban: string;
  currency: string;
  balance: number;
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
}

@Component({
  selector: 'app-account-management-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="page-grid">
      <div class="card">
        <h3>{{ 'nav.accounts_admin' | translate }}</h3>
        <table class="table" *ngIf="accounts().length">
          <thead>
            <tr>
              <th>Holder</th>
              <th>IBAN</th>
              <th>{{ 'common.amount' | translate }}</th>
              <th>{{ 'common.status' | translate }}</th>
              <th>Deposit</th>
              <th>{{ 'common.actions' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let account of accounts()">
              <td>{{ account.holder }}</td>
              <td>{{ account.iban }}</td>
              <td>{{ account.balance | number: '1.2-2' }} {{ account.currency }}</td>
              <td><span class="pill">{{ account.status }}</span></td>
              <td>
                <div class="inline-actions">
                  <input
                    class="input compact-input"
                    type="number"
                    min="1"
                    placeholder="Amount"
                    [value]="depositDrafts()[account.id] || ''"
                    (input)="setDepositDraft(account.id, $any($event.target).value)"
                    [disabled]="account.status !== 'ACTIVE'"
                  />
                  <button
                    class="btn btn-primary btn-sm"
                    type="button"
                    (click)="deposit(account.id)"
                    [disabled]="account.status !== 'ACTIVE' || !depositDrafts()[account.id]"
                  >
                    Add
                  </button>
                </div>
              </td>
              <td>
                <select
                  class="input"
                  [value]="account.status"
                  (change)="updateStatus(account.id, $any($event.target).value)"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="FROZEN">FROZEN</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AccountManagementPageComponent implements OnInit {
  readonly accounts = signal<AccountItem[]>([]);
  readonly depositDrafts = signal<Record<string, string>>({});

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.get<{ items: AccountItem[] }>('/admin/accounts', { page: 1, pageSize: 100 }).subscribe((response) => {
      this.accounts.set(response.items);
    });
  }

  updateStatus(accountId: string, status: 'ACTIVE' | 'FROZEN' | 'CLOSED') {
    this.api.patch(`/admin/accounts/${accountId}`, { status }).subscribe(() => this.load());
  }

  setDepositDraft(accountId: string, value: string) {
    this.depositDrafts.set({
      ...this.depositDrafts(),
      [accountId]: value
    });
  }

  deposit(accountId: string) {
    const amount = Number(this.depositDrafts()[accountId]);
    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }

    this.api
      .post(`/admin/accounts/${accountId}/deposit`, {
        amount,
        description: 'Admin deposit'
      })
      .subscribe(() => {
        this.setDepositDraft(accountId, '');
        this.load();
      });
  }
}
