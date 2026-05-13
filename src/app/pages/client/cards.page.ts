import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../core/api.service';

interface AccountOption {
  id: string;
  label: string;
  iban: string;
  status: string;
}

interface CardItem {
  id: string;
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
  accountLabel: string;
  provider: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
}

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="page-grid relative">
      <div class="card">
        <h3>Request a card</h3>
        <form [formGroup]="requestForm" (ngSubmit)="requestCard()" class="form-grid">
          <select class="input" formControlName="accountId">
            <option value="">Choose an active account</option>
            <option *ngFor="let account of activeAccounts()" [value]="account.id">
              {{ account.label }} - {{ account.iban }}
            </option>
          </select>
          <select class="input" formControlName="provider">
            <option value="VISA">VISA</option>
            <option value="MASTERCARD">MASTERCARD</option>
          </select>
          <button class="btn btn-primary" type="submit" [disabled]="requestForm.invalid || loading()">
            Request card
          </button>
        </form>
        <p *ngIf="info()" class="auth-success">{{ info() }}</p>
        <p *ngIf="error()" class="auth-error">{{ error() }}</p>
      </div>

      <div class="card">
        <h3>{{ 'nav.cards' | translate }}</h3>
        <div class="table-container" style="overflow-x: auto;">
          <table class="table" *ngIf="cards().length; else noCards">
            <thead>
              <tr>
                <th>Card</th>
                <th>{{ 'common.status' | translate }}</th>
                <th>{{ 'cards.limits' | translate }}</th>
                <th>{{ 'common.actions' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let card of cards()">
                <td>{{ card.provider }} **** {{ card.panLast4 }}</td>
                <td><span class="pill">{{ card.status }}</span></td>
                <td>
                  {{ card.limits?.daily || 0 }} / {{ card.limits?.monthly || 0 }}
                </td>
                <td>
                  <div class="inline-actions">
                    <button class="btn btn-secondary btn-sm" type="button" (click)="toggleStatus(card)">
                      {{ card.status === 'ACTIVE' ? ('cards.temporaryBlock' | translate) : ('cards.activate' | translate) }}
                    </button>
                    <button class="btn btn-primary btn-sm" type="button" (click)="viewDetails(card)">
                      Détails
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ng-template #noCards>
          <p class="muted">No cards yet. Request one above and wait for admin approval.</p>
        </ng-template>
      </div>

      <div class="card">
        <h3>Card requests</h3>
        <div class="table-container" style="overflow-x: auto;">
          <table class="table" *ngIf="requests().length; else noRequests">
            <thead>
              <tr>
                <th>Account</th>
                <th>Provider</th>
                <th>{{ 'common.status' | translate }}</th>
                <th>{{ 'common.date' | translate }}</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let request of requests()">
                <td>{{ request.accountLabel }}</td>
                <td>{{ request.provider }}</td>
                <td><span class="pill" [class.warning]="request.status === 'PENDING'">{{ request.status }}</span></td>
                <td>{{ request.createdAt | date:'short' }}</td>
                <td>{{ request.rejectionReason || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ng-template #noRequests>
          <p class="muted">No card requests yet.</p>
        </ng-template>
      </div>
      
      <!-- Card Details Modal -->
      <div class="modal-overlay" *ngIf="selectedCard()" (click)="closeDetails()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closeDetails()">&times;</button>
          <h3 style="margin: 0 0 8px 0;">Détails de la carte</h3>
          <p class="muted" style="margin: 0 0 16px 0;">Informations sécurisées.</p>
          
          <div class="card-details-display">
            <div class="provider">{{ selectedCard()?.provider }}</div>
            <div class="pan">
              **** **** **** {{ selectedCard()?.panLast4 }}
            </div>
            <div class="bottom-row">
              <div>
                <div style="font-size: 0.75rem; opacity: 0.7;">EXP</div>
                <div>{{ getMockExpiry(selectedCard()?.id!) }}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; opacity: 0.7;">CVV</div>
                <div>***</div>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 24px;">
            <p style="font-size: 0.9rem; margin-bottom: 12px;"><strong>Limites actuelles :</strong></p>
            <ul style="font-size: 0.9rem; margin: 0; padding-left: 20px; color: var(--ink-700);">
              <li>Quotidienne : {{ selectedCard()?.limits?.daily || 0 }}</li>
              <li>Mensuelle : {{ selectedCard()?.limits?.monthly || 0 }}</li>
              <li>Retrait DAB : {{ selectedCard()?.limits?.atmDaily || 0 }}</li>
            </ul>
          </div>
        </div>
      </div>
      
    </div>
  `
})
export class CardsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly accounts = signal<AccountOption[]>([]);
  readonly cards = signal<CardItem[]>([]);
  readonly requests = signal<CardRequestItem[]>([]);
  readonly loading = signal(false);
  readonly info = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly selectedCard = signal<CardItem | null>(null);

  readonly requestForm = this.fb.nonNullable.group({
    accountId: ['', Validators.required],
    provider: ['VISA', Validators.required]
  });

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  activeAccounts() {
    return this.accounts().filter((account) => account.status === 'ACTIVE');
  }

  load() {
    this.api.get<{ accounts: AccountOption[] }>('/client/accounts').subscribe((res) => {
      this.accounts.set(res.accounts);
      const active = res.accounts.find((account) => account.status === 'ACTIVE');
      if (active && !this.requestForm.value.accountId) {
        this.requestForm.patchValue({ accountId: active.id });
      }
    });
    this.api.get<{ cards: CardItem[] }>('/client/cards').subscribe((res) => this.cards.set(res.cards));
    this.api.get<{ requests: CardRequestItem[] }>('/client/cards/requests').subscribe((res) => {
      this.requests.set(res.requests);
    });
  }

  requestCard() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.info.set(null);
    this.error.set(null);
    this.api.post('/client/cards/requests', this.requestForm.getRawValue()).subscribe({
      next: () => {
        this.info.set('Card request sent. An admin must approve it before the card appears.');
        this.loading.set(false);
        this.load();
      },
      error: () => {
        this.error.set('Unable to request a card for this account.');
        this.loading.set(false);
      }
    });
  }

  toggleStatus(card: CardItem) {
    const status = card.status === 'ACTIVE' ? 'TEMP_BLOCKED' : 'ACTIVE';
    this.api.patch(`/client/cards/${card.id}/status`, { status }).subscribe(() => this.load());
  }
  
  viewDetails(card: CardItem) {
    this.selectedCard.set(card);
  }
  
  closeDetails() {
    this.selectedCard.set(null);
  }
  
  getMockExpiry(cardId: string): string {
    // Generate consistent fake expiry date based on card id
    const month = (cardId.charCodeAt(0) % 12) + 1;
    const year = new Date().getFullYear() % 100 + (cardId.charCodeAt(1) % 5) + 1;
    return `${month.toString().padStart(2, '0')}/${year}`;
  }
}
