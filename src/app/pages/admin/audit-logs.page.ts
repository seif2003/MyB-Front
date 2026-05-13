import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../core/api.service';

interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  user: string;
  ip: string | null;
  createdAt: string;
  metadata: Record<string, unknown>;
}

@Component({
  selector: 'app-audit-logs-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="page-grid">
      <div class="card">
        <h3>{{ 'nav.audit' | translate }}</h3>
        <table class="table" *ngIf="logs().length">
          <thead>
            <tr>
              <th>{{ 'common.date' | translate }}</th>
              <th>Action</th>
              <th>Entity</th>
              <th>User</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let log of logs()">
              <td>{{ log.createdAt | date: 'short' }}</td>
              <td>{{ log.action }}</td>
              <td>{{ log.entity }} / {{ log.entityId }}</td>
              <td>{{ log.user }}</td>
              <td>{{ log.ip || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AuditLogsPageComponent implements OnInit {
  readonly logs = signal<AuditLogItem[]>([]);

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<{ items: AuditLogItem[] }>('/admin/audit', { page: 1, pageSize: 100 }).subscribe((response) => {
      this.logs.set(response.items);
    });
  }
}
