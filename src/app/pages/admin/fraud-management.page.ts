import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../core/api.service';

interface FraudItem {
  id: string;
  transactionId: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  riskScore: number;
  reason: string;
  createdAt: string;
}

@Component({
  selector: 'app-fraud-management-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="page-grid">
      <div class="card">
        <h3>{{ 'nav.fraud' | translate }}</h3>
        <table class="table" *ngIf="fraudCases().length">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Risk</th>
              <th>Reason</th>
              <th>{{ 'common.status' | translate }}</th>
              <th>{{ 'common.actions' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let fraud of fraudCases()">
              <td>{{ fraud.transactionId }}</td>
              <td>{{ fraud.riskScore }}</td>
              <td>{{ fraud.reason }}</td>
              <td><span class="pill warning">{{ fraud.status }}</span></td>
              <td>
                <select class="input" [value]="fraud.status" (change)="updateStatus(fraud.id, $any($event.target).value)">
                  <option value="OPEN">OPEN</option>
                  <option value="INVESTIGATING">INVESTIGATING</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="DISMISSED">DISMISSED</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class FraudManagementPageComponent implements OnInit {
  readonly fraudCases = signal<FraudItem[]>([]);

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.get<{ items: FraudItem[] }>('/admin/fraud', { page: 1, pageSize: 100 }).subscribe((response) => {
      this.fraudCases.set(response.items);
    });
  }

  updateStatus(fraudId: string, status: FraudItem['status']) {
    this.api.patch(`/admin/fraud/${fraudId}`, { status }).subscribe(() => this.load());
  }
}
