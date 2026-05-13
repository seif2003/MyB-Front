import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../core/api.service';
import { RealtimeService } from '../../core/realtime.service';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, HlmButtonModule, TranslateModule],
  template: `
    <div class="page-grid">
      <div class="card">
        <h3>{{ 'nav.notifications' | translate }}</h3>
        <button hlmBtn variant="outline" (click)="markAll()">Tout marquer comme lu</button>
        <table class="table" *ngIf="notifications().length">
          <thead>
            <tr>
              <th>Type</th>
              <th>Message</th>
              <th>{{ 'common.date' | translate }}</th>
              <th>{{ 'common.actions' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let n of notifications()">
              <td>{{ n.type }}</td>
              <td>{{ n.title }} - {{ n.message }}</td>
              <td>{{ n.createdAt | date:'short' }}</td>
              <td>
                <button hlmBtn size="sm" variant="ghost" (click)="markRead(n.id)">OK</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class NotificationsPageComponent implements OnInit {
  readonly notifications = signal<any[]>([]);

  constructor(
    private readonly api: ApiService,
    private readonly realtime: RealtimeService
  ) {
    effect(() => {
      const live = this.realtime.notifications();
      if (!live.length) {
        return;
      }

      const existing = this.notifications();
      const seen = new Set(existing.map((item) => item.id));
      const merged = [...existing];

      for (const item of live) {
        if (!seen.has(item.id)) {
          merged.unshift(item);
          seen.add(item.id);
        }
      }

      this.notifications.set(merged);
    });
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.get<{ items: any[] }>('/client/notifications').subscribe((res) => this.notifications.set(res.items));
  }

  markRead(id: string) {
    this.api.post(`/client/notifications/${id}/read`, {}).subscribe(() => this.load());
  }

  markAll() {
    this.api.post('/client/notifications/read-all', {}).subscribe(() => this.load());
  }
}
