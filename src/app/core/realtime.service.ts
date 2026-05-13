import { Injectable, signal } from '@angular/core';
import { REALTIME_URL } from './config';
import { AuthService } from './auth.service';

interface RealtimeEvent<TPayload = unknown> {
  type: 'NOTIFICATION' | 'BALANCE_UPDATE';
  eventId: string;
  payload: TPayload;
  createdAt: string;
}

interface NotificationPayload {
  id: string;
  type: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

interface BalancePayload {
  totalBalance: number;
  accounts: Array<{
    id: string;
    label: string;
    currency: string;
    balance: number;
    status: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private socket: WebSocket | null = null;
  private readonly _connected = signal(false);
  private readonly _notifications = signal<NotificationPayload[]>([]);
  private readonly _balanceUpdate = signal<BalancePayload | null>(null);

  readonly connected = this._connected.asReadonly();
  readonly notifications = this._notifications.asReadonly();
  readonly balanceUpdate = this._balanceUpdate.asReadonly();

  constructor(private readonly auth: AuthService) {}

  connect() {
    const token = this.auth.accessToken();
    if (!token) {
      return;
    }

    if (this.socket) {
      this.socket.close();
    }

    this.socket = new WebSocket(`${REALTIME_URL}?token=${token}`);
    this.socket.onopen = () => this._connected.set(true);
    this.socket.onclose = () => this._connected.set(false);
    this.socket.onmessage = (event) => this.handleMessage(event.data);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private handleMessage(rawData: unknown) {
    try {
      const parsed = JSON.parse(String(rawData)) as RealtimeEvent;
      if (parsed.type === 'NOTIFICATION') {
        this._notifications.set([parsed.payload as NotificationPayload, ...this._notifications()]);
      }

      if (parsed.type === 'BALANCE_UPDATE') {
        this._balanceUpdate.set(parsed.payload as BalancePayload);
      }
    } catch (err) {
      console.warn('Invalid realtime payload', err);
    }
  }
}
