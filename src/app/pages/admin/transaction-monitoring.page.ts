import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { ApiService } from '../../core/api.service';

interface TransactionItem {
  id: string;
  accountId: string;
  holder: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface TransferItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  fromUser: string;
  beneficiary: string | null;
  createdAt: string;
}

@Component({
  selector: 'app-transaction-monitoring-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, HlmButtonModule],
  template: `
    <div class="page-grid">
      <div class="card">
        <h3>{{ 'nav.transactions' | translate }}</h3>
        <form [formGroup]="filterForm" (ngSubmit)="loadTransactions()" class="form-grid">
          <select class="input" formControlName="status">
            <option value="">All status</option>
            <option value="PENDING">PENDING</option>
            <option value="BOOKED">BOOKED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <select class="input" formControlName="type">
            <option value="">All type</option>
            <option value="DEBIT">DEBIT</option>
            <option value="CREDIT">CREDIT</option>
          </select>
          <button hlmBtn variant="outline" type="submit">{{ 'common.filter' | translate }}</button>
        </form>

        <table class="table" *ngIf="transactions().length">
          <thead>
            <tr>
              <th>Holder</th>
              <th>Type</th>
              <th>{{ 'common.amount' | translate }}</th>
              <th>{{ 'common.status' | translate }}</th>
              <th>{{ 'common.date' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of transactions()">
              <td>{{ item.holder }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.amount | number: '1.2-2' }} {{ item.currency }}</td>
              <td><span class="pill">{{ item.status }}</span></td>
              <td>{{ item.createdAt | date: 'short' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <h3>{{ 'admin.transferValidation' | translate }}</h3>
        <table class="table" *ngIf="transfers().length">
          <thead>
            <tr>
              <th>User</th>
              <th>Beneficiary</th>
              <th>{{ 'common.amount' | translate }}</th>
              <th>{{ 'common.status' | translate }}</th>
              <th>{{ 'common.actions' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let transfer of transfers()">
              <td>{{ transfer.fromUser }}</td>
              <td>{{ transfer.beneficiary || '-' }}</td>
              <td>{{ transfer.amount | number: '1.2-2' }} {{ transfer.currency }}</td>
              <td><span class="pill">{{ transfer.status }}</span></td>
              <td style="display: flex; gap: 8px;">
                <button hlmBtn size="sm" variant="outline" (click)="approve(transfer.id)">
                  Approve
                </button>
                <button hlmBtn size="sm" variant="outline" (click)="reject(transfer.id)">
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class TransactionMonitoringPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly transactions = signal<TransactionItem[]>([]);
  readonly transfers = signal<TransferItem[]>([]);

  readonly filterForm = this.fb.nonNullable.group({
    status: '',
    type: ''
  });

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.loadTransactions();
    this.loadTransfers();
  }

  loadTransactions() {
    const value = this.filterForm.getRawValue();
    const params: Record<string, string | number | boolean> = {
      page: 1,
      pageSize: 100
    };
    if (value.status) {
      params['status'] = value.status;
    }
    if (value.type) {
      params['type'] = value.type;
    }

    this.api.get<{ items: TransactionItem[] }>('/admin/transactions', params).subscribe((response) => {
      this.transactions.set(response.items);
    });
  }

  loadTransfers() {
    this.api
      .get<{ items: TransferItem[] }>('/admin/transfers', { status: 'PENDING', page: 1, pageSize: 100 })
      .subscribe((response) => {
        this.transfers.set(response.items);
      });
  }

  approve(transferId: string) {
    this.api.post(`/admin/transfers/${transferId}/approve`, {}).subscribe(() => {
      this.loadTransfers();
      this.loadTransactions();
    });
  }

  reject(transferId: string) {
    this.api.post(`/admin/transfers/${transferId}/reject`, {}).subscribe(() => {
      this.loadTransfers();
    });
  }
}
