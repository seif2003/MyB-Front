import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../core/api.service';

interface CardItem {
  id: string;
  userId: string;
  holder: string;
  accountId: string;
  panLast4: string;
  provider: string;
  status: 'ACTIVE' | 'TEMP_BLOCKED' | 'PERM_BLOCKED';
  limits?: {
    daily: number;
    monthly: number;
    atmDaily: number;
  };
}

interface CardRequestItem {
  id: string;
  holder: string;
  email: string;
  accountLabel: string;
  iban: string;
  provider: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  rejectionReason?: string | null;
}

@Component({
  selector: 'app-card-management-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="page-grid">
      <div class="card">
        <h3>Card requests</h3>
        <table class="table" *ngIf="requests().length; else noRequests">
          <thead>
            <tr>
              <th>Holder</th>
              <th>Account</th>
              <th>Provider</th>
              <th>{{ 'common.status' | translate }}</th>
              <th>{{ 'common.actions' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let request of requests()">
              <td>
                {{ request.holder }}
                <div class="muted">{{ request.email }}</div>
              </td>
              <td>
                {{ request.accountLabel }}
                <div class="muted">{{ request.iban }}</div>
              </td>
              <td>{{ request.provider }}</td>
              <td><span class="pill" [class.warning]="request.status === 'PENDING'">{{ request.status }}</span></td>
              <td>
                <div class="inline-actions">
                  <button
                    class="btn btn-primary btn-sm"
                    type="button"
                    (click)="approveRequest(request.id)"
                    [disabled]="request.status !== 'PENDING'"
                  >
                    Approve
                  </button>
                  <button
                    class="btn btn-secondary btn-sm"
                    type="button"
                    (click)="rejectRequest(request.id)"
                    [disabled]="request.status !== 'PENDING'"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #noRequests>
          <p class="muted">No card requests.</p>
        </ng-template>
      </div>

      <div class="card">
        <h3>{{ 'nav.cards_admin' | translate }}</h3>
        <table class="table" *ngIf="cards().length">
          <thead>
            <tr>
              <th>Holder</th>
              <th>Card</th>
              <th>{{ 'cards.limits' | translate }}</th>
              <th>{{ 'common.status' | translate }}</th>
              <th>{{ 'common.actions' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let card of cards()">
              <td>{{ card.holder }}</td>
              <td>{{ card.provider }} **** {{ card.panLast4 }}</td>
              <td>{{ card.limits?.daily || 0 }} / {{ card.limits?.monthly || 0 }}</td>
              <td><span class="pill">{{ card.status }}</span></td>
              <td>
                <select class="input" [value]="card.status" (change)="updateStatus(card.id, $any($event.target).value)">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="TEMP_BLOCKED">TEMP_BLOCKED</option>
                  <option value="PERM_BLOCKED">PERM_BLOCKED</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class CardManagementPageComponent implements OnInit {
  readonly cards = signal<CardItem[]>([]);
  readonly requests = signal<CardRequestItem[]>([]);

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.get<{ items: CardItem[] }>('/admin/cards', { page: 1, pageSize: 100 }).subscribe((response) => {
      this.cards.set(response.items);
    });
    this.api
      .get<{ items: CardRequestItem[] }>('/admin/card-requests', { page: 1, pageSize: 100 })
      .subscribe((response) => {
        this.requests.set(response.items);
      });
  }

  updateStatus(cardId: string, status: 'ACTIVE' | 'TEMP_BLOCKED' | 'PERM_BLOCKED') {
    this.api.patch(`/admin/cards/${cardId}`, { status }).subscribe(() => this.load());
  }

  approveRequest(requestId: string) {
    this.api.post(`/admin/card-requests/${requestId}/approve`, {}).subscribe(() => this.load());
  }

  rejectRequest(requestId: string) {
    this.api
      .post(`/admin/card-requests/${requestId}/reject`, { reason: 'Rejected by admin' })
      .subscribe(() => this.load());
  }
}
