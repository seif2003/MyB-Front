import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-transfers-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, HlmButtonModule],
  template: `
    <div class="transfers-wrapper">
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">{{ 'nav.transfers' | translate }}</h1>
          <p class="page-subtitle">{{ 'transfers.page.subtitle' | translate }}</p>
        </div>
        <div class="quick-stats">
          <div class="stat-item">
            <span class="stat-value">{{ accounts().length }}</span>
            <span class="stat-label">{{ 'common.accounts' | translate }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ beneficiaries().length }}</span>
            <span class="stat-label">{{ 'transfers.contacts' | translate }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ scheduled().length }}</span>
            <span class="stat-label">{{ 'transfers.scheduled' | translate }}</span>
          </div>
        </div>
      </header>

      <div class="transfers-layout">
        <!-- Main Column: Transfer Initiation & History -->
        <main class="main-column">
          <!-- The Send Money Card -->
          <div class="card premium-card">
            <div class="card-title-group">
              <h2>{{ 'transfers.page.sendMoney' | translate }}</h2>
              <p class="muted">{{ 'transfers.page.sendMoneyHint' | translate }}</p>
            </div>

            <!-- Custom Tabs -->
            <div class="custom-tabs">
              <button class="tab-btn" [class.active]="activeTab() === 'internal'" (click)="activeTab.set('internal')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon"><path d="M8 17l4 4 4-4"/><path d="M12 2v19"/><path d="M20 7l-4-4-4 4"/><path d="M16 3v11"/></svg>
                {{ 'transfers.page.betweenAccounts' | translate }}
              </button>
              <button class="tab-btn" [class.active]="activeTab() === 'external'" (click)="activeTab.set('external')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                {{ 'transfers.page.externalPayee' | translate }}
              </button>
              <button class="tab-btn" [class.active]="activeTab() === 'scheduled'" (click)="activeTab.set('scheduled')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ 'transfers.page.scheduleLater' | translate }}
              </button>
            </div>

            <div class="tab-content" [ngSwitch]="activeTab()">
              <!-- INTERNAL TRANSFER -->
              <form *ngSwitchCase="'internal'" [formGroup]="internalForm" (ngSubmit)="submitInternal()" class="fancy-form fade-in">
                <div class="form-row two-cols">
                  <div class="fancy-field">
                    <label>{{ 'transfers.page.fromAccount' | translate }}</label>
                    <select class="fancy-input" formControlName="fromAccountId">
                      <option value="" disabled selected>{{ 'transfers.page.selectOrigin' | translate }}</option>
                      <option *ngFor="let account of accounts()" [value]="account.id">{{ account.label }} • {{ account.balance | currency:account.currency:'symbol':'.2-2' }}</option>
                    </select>
                  </div>
                  <div class="fancy-field">
                    <label>{{ 'transfers.page.toAccount' | translate }}</label>
                    <select class="fancy-input" formControlName="toAccountId">
                      <option value="" disabled selected>{{ 'transfers.page.selectDestination' | translate }}</option>
                      <option *ngFor="let account of accounts()" [value]="account.id">{{ account.label }}</option>
                    </select>
                  </div>
                </div>
                
                <div class="fancy-field amount-field">
                  <label>{{ 'transfers.page.amountToTransfer' | translate }}</label>
                  <div class="amount-wrapper">
                    <span class="currency-prefix">€</span>
                    <input type="number" formControlName="amount" class="fancy-input large-amount" placeholder="0.00" min="1" step="0.01" />
                  </div>
                </div>

                <div class="form-footer">
                  <span class="hint"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 12 12 12 8"></polyline><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> {{ 'transfers.page.internalHint' | translate }}</span>
                  <button hlmBtn class="submit-btn" type="submit" [disabled]="internalForm.invalid">{{ 'transfers.page.transferNow' | translate }}</button>
                </div>
              </form>

              <!-- EXTERNAL TRANSFER -->
              <form *ngSwitchCase="'external'" [formGroup]="externalForm" (ngSubmit)="submitExternal()" class="fancy-form fade-in">
                <div class="form-row two-cols">
                  <div class="fancy-field">
                    <label>{{ 'transfers.page.fromAccount' | translate }}</label>
                    <select class="fancy-input" formControlName="fromAccountId">
                      <option value="" disabled selected>{{ 'transfers.page.selectOrigin' | translate }}</option>
                      <option *ngFor="let account of accounts()" [value]="account.id">{{ account.label }}</option>
                    </select>
                  </div>
                  <div class="fancy-field">
                    <label>{{ 'transfers.page.toBeneficiary' | translate }}</label>
                    <select class="fancy-input" formControlName="beneficiaryId">
                      <option value="" disabled selected>{{ 'transfers.page.selectPayee' | translate }}</option>
                      <option *ngFor="let b of beneficiaries()" [value]="b.id">{{ b.name }}</option>
                    </select>
                    <p class="field-hint" *ngIf="!beneficiaries().length">{{ 'transfers.page.noContactsYet' | translate }}</p>
                  </div>
                </div>

                <div class="fancy-field amount-field">
                  <label>{{ 'transfers.page.amountToTransfer' | translate }}</label>
                  <div class="amount-wrapper">
                    <span class="currency-prefix">€</span>
                    <input type="number" formControlName="amount" class="fancy-input large-amount" placeholder="0.00" min="1" step="0.01" />
                  </div>
                </div>

                <div class="form-footer">
                  <span class="hint warning-hint"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> {{ 'transfers.page.externalHint' | translate }}</span>
                  <button hlmBtn class="submit-btn" type="submit" [disabled]="externalForm.invalid">{{ 'transfers.page.sendPayment' | translate }}</button>
                 </div>
              </form>

              <!-- SCHEDULED TRANSFER -->
              <form *ngSwitchCase="'scheduled'" [formGroup]="scheduledForm" (ngSubmit)="scheduleTransfer()" class="fancy-form fade-in">
                <div class="form-row two-cols">
                  <div class="fancy-field">
                    <label>{{ 'transfers.page.fromAccount' | translate }}</label>
                    <select class="fancy-input" formControlName="fromAccountId">
                      <option value="" disabled selected>{{ 'transfers.page.selectOrigin' | translate }}</option>
                      <option *ngFor="let account of accounts()" [value]="account.id">{{ account.label }}</option>
                    </select>
                  </div>
                  <div class="fancy-field">
                    <label>{{ 'transfers.page.toBeneficiary' | translate }}</label>
                    <select class="fancy-input" formControlName="beneficiaryId">
                      <option value="" disabled selected>{{ 'transfers.page.selectPayee' | translate }}</option>
                      <option *ngFor="let b of beneficiaries()" [value]="b.id">{{ b.name }}</option>
                    </select>
                  </div>
                </div>

                <div class="form-row two-cols">
                  <div class="fancy-field">
                    <label>{{ 'transfers.page.executionDate' | translate }}</label>
                    <input type="datetime-local" class="fancy-input" formControlName="scheduledAt" />
                  </div>
                  <div class="fancy-field amount-field small">
                    <label>{{ 'transfers.page.amount' | translate }}</label>
                    <div class="amount-wrapper">
                      <span class="currency-prefix">€</span>
                      <input type="number" formControlName="amount" class="fancy-input" placeholder="0.00" min="1" step="0.01" />
                    </div>
                  </div>
                </div>

                <div class="form-footer">
                  <span class="hint"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> {{ 'transfers.page.scheduleHint' | translate }}</span>
                  <button hlmBtn variant="outline" class="submit-btn-outline" type="submit" [disabled]="scheduledForm.invalid">{{ 'transfers.page.scheduleTransfer' | translate }}</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Activity / History -->
          <div class="card premium-card mt-6">
            <div class="card-title-group mb-4">
              <div class="title-with-action">
                <h2>{{ 'transfers.page.recentActivity' | translate }}</h2>
              </div>
            </div>

            <div class="activity-list" *ngIf="transfers().length; else noTransfers">
              <div class="activity-item" *ngFor="let t of transfers()">
                <div class="activity-icon" [ngClass]="t.status.toLowerCase()">
                  <svg *ngIf="t.status === 'COMPLETED'" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <svg *ngIf="t.status === 'PENDING'" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <svg *ngIf="t.status === 'FAILED' || t.status === 'REJECTED'" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
                <div class="activity-details">
                  <span class="activity-title">Transfer {{ t.id.slice(0,8) }}</span>
                  <span class="activity-time">{{ t.createdAt | date:'medium' }}</span>
                </div>
                <div class="activity-amounts">
                  <span class="activity-amount">-{{ t.amount | currency:t.currency:'symbol':'.2-2' }}</span>
                  <span class="status-badge" [ngClass]="t.status.toLowerCase()">{{ t.status | titlecase }}</span>
                </div>
              </div>
            </div>
            <ng-template #noTransfers>
              <div class="empty-state-modern">
                <div class="empty-icon"><svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg></div>
                <p>{{ 'transfers.page.noActivity' | translate }}</p>
                <span class="muted">{{ 'transfers.page.transactionsAppear' | translate }}</span>
              </div>
            </ng-template>
          </div>
        </main>

        <!-- Right Column: Contacts / Scheduled -->
        <aside class="sidebar-column">
          <!-- Beneficiaries Widget -->
          <div class="widget-card">
            <div class="widget-header">
              <h3>{{ 'transfers.contacts' | translate }}</h3>
            </div>
            
            <div class="widget-list" *ngIf="beneficiaries().length; else noBeneficiaries">
              <div class="contact-item" *ngFor="let b of beneficiaries()">
                <div class="contact-avatar">{{ b.name.charAt(0) | uppercase }}</div>
                <div class="contact-info">
                  <span class="contact-name">{{ b.name }}</span>
                  <span class="contact-iban">{{ b.iban }}</span>
                </div>
                <button class="delete-icon-btn" (click)="deleteBeneficiary(b.id)" [title]="'transfers.page.removeContact' | translate">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
            <ng-template #noBeneficiaries>
              <div class="empty-state-modern small">
                 <p class="muted">{{ 'transfers.page.noSavedContacts' | translate }}</p>
              </div>
            </ng-template>

            <!-- Quick Add Beneficiary -->
            <div class="widget-footer-action">
              <button class="text-link" (click)="showNewContact = !showNewContact">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> 
                {{ 'transfers.page.addNewContact' | translate }}
              </button>
              
              <form *ngIf="showNewContact" [formGroup]="beneficiaryForm" (ngSubmit)="addBeneficiary()" class="quick-add-form fade-in">
                <input class="fancy-input small" formControlName="name" [placeholder]="'transfers.page.contactName' | translate" />
                <input class="fancy-input small" formControlName="iban" [placeholder]="'transfers.page.ibanPlaceholder' | translate" />
                <button hlmBtn size="sm" type="submit" [disabled]="beneficiaryForm.invalid" class="w-full mt-2">{{ 'transfers.page.saveContact' | translate }}</button>
              </form>
            </div>
          </div>

          <!-- Scheduled Widget -->
          <div class="widget-card">
            <div class="widget-header">
              <h3>{{ 'transfers.page.upcoming' | translate }}</h3>
            </div>
            <div class="widget-list" *ngIf="scheduled().length; else noScheduled">
              <div class="scheduled-item" *ngFor="let s of scheduled()">
                <div class="sched-date">
                  <span class="s-day">{{ s.scheduledAt | date:'dd' }}</span>
                  <span class="s-month">{{ s.scheduledAt | date:'MMM' }}</span>
                </div>
                <div class="sched-info">
                  <span class="s-amount">{{ s.amount | currency:s.currency:'symbol':'.2-2' }}</span>
                  <span class="s-status">{{ 'transfers.scheduled' | translate }}</span>
                </div>
              </div>
            </div>
            <ng-template #noScheduled>
              <div class="empty-state-modern small">
                 <p class="muted">{{ 'transfers.page.noUpcomingTransfers' | translate }}</p>
              </div>
            </ng-template>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .transfers-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding-bottom: 40px;
      font-family: var(--font-sans, system-ui, sans-serif);
      color: var(--ink-800);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 20px;
    }
    .header-content h1 {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0 0 8px 0;
    }
    .header-content p {
      margin: 0;
      color: var(--ink-500);
      font-size: 1.05rem;
    }

    .quick-stats {
      display: flex;
      background: var(--surface-1);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 12px 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 16px;
    }
    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--brand-teal);
      line-height: 1.2;
    }
    .stat-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ink-400);
      font-weight: 600;
      margin-top: 4px;
    }
    .stat-divider {
      width: 1px;
      background: var(--border);
      margin: 0 8px;
    }

    .transfers-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 32px;
      align-items: start;
    }

    .premium-card {
      background: var(--surface-1);
      border-radius: 16px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 20px rgba(0,0,0,0.03), 0 1px 4px rgba(0,0,0,0.02);
      padding: 32px;
      overflow: hidden;
    }
    .card-title-group h2 {
      margin: 0 0 4px 0;
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .mt-6 { margin-top: 24px; }
    .mb-4 { margin-bottom: 16px; }

    .custom-tabs {
      display: flex;
      gap: 8px;
      margin: 24px 0 32px 0;
      border-bottom: 2px solid var(--border);
      padding-bottom: 0px;
    }
    .tab-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: none;
      padding: 12px 16px;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--ink-400);
      cursor: pointer;
      position: relative;
      transition: color 0.2s ease;
      margin-bottom: -2px;
      border-bottom: 2px solid transparent;
    }
    .tab-btn:hover {
      color: var(--ink-600);
    }
    .tab-btn.active {
      color: var(--brand-teal);
      border-bottom: 2px solid var(--brand-teal);
    }
    .tab-icon {
      opacity: 0.7;
    }
    .tab-btn.active .tab-icon {
      opacity: 1;
    }

    .fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fancy-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .form-row.two-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .fancy-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .fancy-field label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--ink-500);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .fancy-input {
      width: 100%;
      padding: 14px 16px;
      border: 1px solid var(--border-dark, #cbd5e1);
      background: var(--surface-2);
      border-radius: var(--radius-sm);
      font-size: 1rem;
      font-family: inherit;
      color: var(--ink-800);
      transition: all 0.2s;
      appearance: none;
    }
    .fancy-input:focus {
      outline: none;
      border-color: var(--brand-teal);
      box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
      background: var(--surface-1);
    }
    .fancy-input.small {
      padding: 10px 12px;
      font-size: 0.9rem;
    }
    select.fancy-input {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
      padding-right: 40px;
    }
    
    .amount-field {
      margin-top: 8px;
    }
    .amount-field.small {
      margin-top: 0;
    }
    .amount-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .currency-prefix {
      position: absolute;
      left: 20px;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--ink-600);
      pointer-events: none;
    }
    .amount-field.small .currency-prefix {
      font-size: 1.1rem;
      left: 14px;
    }
    .large-amount {
      font-size: 2rem !important;
      font-weight: 700;
      padding-left: 48px !important;
      height: 72px;
    }
    .amount-field.small .fancy-input {
      padding-left: 36px !important;
    }

    .field-hint {
      font-size: 0.8rem;
      color: var(--ink-400);
      margin: 4px 0 0 0;
    }

    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }
    .hint {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
      color: var(--ink-500);
    }
    .hint.warning-hint {
      color: #b45309;
    }
    .submit-btn {
      padding: 0 32px;
      height: 48px;
      font-size: 1.05rem;
      font-weight: 600;
      border-radius: var(--radius-sm);
    }
    .submit-btn-outline {
      border: 2px solid var(--brand-teal);
      color: var(--brand-teal);
      background: transparent;
      padding: 0 32px;
      height: 48px;
      font-size: 1.05rem;
      font-weight: 600;
      border-radius: var(--radius-sm);
    }
    .submit-btn-outline:hover:not([disabled]) {
      background: rgba(13, 148, 136, 0.05);
    }

    .title-with-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .text-link {
      background: transparent;
      border: none;
      color: var(--brand-teal);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0;
    }
    .text-link:hover { text-decoration: underline; }
    
    .activity-list {
      display: flex;
      flex-direction: column;
    }
    .activity-item {
      display: flex;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid var(--border);
      gap: 16px;
    }
    .activity-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-2);
      flex-shrink: 0;
    }
    .activity-icon.completed { background: #dcfce7; color: #0f766e; }
    .activity-icon.pending { background: #fef08a; color: #b45309; }
    .activity-icon.failed, .activity-icon.rejected { background: #fee2e2; color: #b91c1c; }
    
    .activity-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .activity-title { font-weight: 600; color: var(--ink-800); }
    .activity-time { font-size: 0.85rem; color: var(--ink-400); }
    
    .activity-amounts {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }
    .activity-amount { font-weight: 700; font-size: 1.05rem; }
    
    .status-badge {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 12px;
      letter-spacing: 0.05em;
    }
    .status-badge.completed { background: #dcfce7; color: #0f766e; }
    .status-badge.pending { background: #fef08a; color: #b45309; }
    .status-badge.failed, .status-badge.rejected { background: #fee2e2; color: #b91c1c; }

    .empty-state-modern {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;
      background: var(--surface-2);
      border-radius: 12px;
      border: 1px dashed var(--border);
    }
    .empty-state-modern.small {
      padding: 24px 16px;
    }
    .empty-icon {
      color: var(--ink-300);
      margin-bottom: 12px;
    }
    .empty-state-modern p {
      font-weight: 600;
      color: var(--ink-600);
      margin: 0 0 4px 0;
    }
    .empty-state-modern span {
      font-size: 0.9rem;
    }

    .sidebar-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .widget-card {
      background: var(--surface-1);
      border-radius: 16px;
      border: 1px solid var(--border);
      box-shadow: 0 2px 12px rgba(0,0,0,0.02);
      overflow: hidden;
    }
    .widget-header {
      padding: 20px 24px 0 24px;
    }
    .widget-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
    }
    .widget-list {
      padding: 16px 24px;
      display: flex;
      flex-direction: column;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
    }
    .contact-item:last-child {
      border-bottom: none;
    }
    .contact-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--brand-teal);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .contact-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .contact-name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .contact-iban { font-size: 0.8rem; color: var(--ink-400); font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .delete-icon-btn {
      background: transparent;
      border: none;
      color: var(--ink-300);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }
    .delete-icon-btn:hover {
      color: #ef4444;
      background: #fee2e2;
    }

    .widget-footer-action {
      border-top: 1px solid var(--border);
      background: var(--surface-2);
      padding: 16px 24px;
    }
    .quick-add-form {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .scheduled-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
    }
    .scheduled-item:last-child {
      border-bottom: none;
    }
    .sched-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 48px;
      height: 48px;
      flex-shrink: 0;
    }
    .s-day { font-weight: 700; font-size: 1.1rem; line-height: 1; color: var(--brand-teal); }
    .s-month { font-size: 0.7rem; text-transform: uppercase; font-weight: 600; color: var(--ink-400); margin-top: 2px; }
    .sched-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .s-amount { font-weight: 700; font-size: 1.1rem; }
    .s-status { font-size: 0.8rem; color: var(--ink-400); font-weight: 500; }

    @media (max-width: 900px) {
      .transfers-layout {
        grid-template-columns: 1fr;
      }
      .page-header { flex-direction: column; align-items: stretch; }
      .quick-stats { flex-wrap: wrap; justify-content: space-between; }
    }
    @media (max-width: 600px) {
      .form-row.two-cols { grid-template-columns: 1fr; gap: 12px; }
      .form-footer { flex-direction: column; align-items: stretch; gap: 16px; }
      .hint { justify-content: center; text-align: center; }
      .premium-card { padding: 20px; }
      .custom-tabs { overflow-x: auto; }
      .tab-btn { white-space: nowrap; }
    }
  `]
})
export class TransfersPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);

  readonly activeTab = signal<'internal' | 'external' | 'scheduled'>('internal');
  showNewContact = false;

  readonly accounts = signal<any[]>([]);
  readonly beneficiaries = signal<any[]>([]);
  readonly scheduled = signal<any[]>([]);
  readonly transfers = signal<any[]>([]);

  readonly internalForm = this.fb.group({
    fromAccountId: ['', Validators.required],
    toAccountId: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(1)]]
  });

  readonly externalForm = this.fb.group({
    fromAccountId: ['', Validators.required],
    beneficiaryId: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(1)]]
  });

  readonly beneficiaryForm = this.fb.group({
    name: ['', Validators.required],
    iban: ['', Validators.required]
  });

  readonly scheduledForm = this.fb.group({
    fromAccountId: ['', Validators.required],
    beneficiaryId: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(1)]],
    scheduledAt: ['', Validators.required]
  });

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.api.get<{ accounts: any[] }>('/client/accounts').subscribe((res) => this.accounts.set(res.accounts));
    this.api.get<{ beneficiaries: any[] }>('/client/beneficiaries').subscribe((res) => this.beneficiaries.set(res.beneficiaries));
    this.api.get<{ scheduled: any[] }>('/client/transfers/scheduled').subscribe((res) => this.scheduled.set(res.scheduled));
    this.api.get<{ items: any[] }>('/client/transfers').subscribe((res) => this.transfers.set(res.items));
  }

  submitInternal() {
    if (this.internalForm.invalid) {
      return;
    }
    this.api.post('/client/transfers/internal', this.internalForm.value).subscribe(() => {
      this.internalForm.patchValue({ amount: null });
      this.refresh();
    });
  }

  submitExternal() {
    if (this.externalForm.invalid) {
      return;
    }
    this.api.post('/client/transfers/external', this.externalForm.value).subscribe(() => {
      this.externalForm.patchValue({ amount: null });
      this.refresh();
    });
  }

  addBeneficiary() {
    if (this.beneficiaryForm.invalid) {
      return;
    }
    this.api.post('/client/beneficiaries', this.beneficiaryForm.value).subscribe(() => {
      this.beneficiaryForm.reset();
      this.refresh();
    });
  }

  deleteBeneficiary(id: string) {
    if (confirm(this.translate.instant('transfers.page.deleteContactConfirm'))) {
      this.api.delete(`/client/beneficiaries/${id}`).subscribe(() => this.refresh());
    }
  }

  scheduleTransfer() {
    if (this.scheduledForm.invalid) {
      return;
    }
    this.api.post('/client/transfers/scheduled', this.scheduledForm.value).subscribe(() => {
      this.scheduledForm.patchValue({ amount: null, scheduledAt: '' });
      this.refresh();
    });
  }
}
