import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { ApiService } from '../../core/api.service';

interface RoleView {
  id: string;
  name: string;
  permissions: string[];
}

interface PermissionView {
  id: string;
  key: string;
}

const permissionDescriptions: Record<string, string> = {
  'client.dashboard.view': 'Allows a client to view their dashboard.',
  'client.accounts.view': 'Allows a client to view their own accounts.',
  'client.transactions.view': 'Allows a client to view account transactions.',
  'client.transfers.create': 'Allows a client to create transfers.',
  'client.beneficiaries.manage': 'Allows a client to manage beneficiaries.',
  'client.cards.manage': 'Allows a client to manage cards.',
  'client.notifications.view': 'Allows a client to view notifications.',
  'client.profile.manage': 'Allows a client to update profile details.',
  'client.analytics.view': 'Allows a client to view analytics.',
  'support.tickets.view': 'Allows support to view tickets.',
  'support.users.view': 'Allows support to view users.',
  'support.accounts.view': 'Allows support to view accounts.',
  'backoffice.transactions.monitor': 'Allows back office to monitor transactions.',
  'backoffice.transfers.validate': 'Allows back office to approve or reject transfers.',
  'backoffice.accounts.manage': 'Allows back office to manage accounts.',
  'backoffice.cards.manage': 'Allows back office to manage cards.',
  'backoffice.fraud.manage': 'Allows back office to review fraud cases.',
  'admin.users.manage': 'Allows admins to manage users.',
  'admin.roles.manage': 'Allows admins to manage role permissions.',
  'admin.audit.view': 'Allows admins to view audit logs.',
  'admin.kpi.view': 'Allows admins to view key metrics.'
};

@Component({
  selector: 'app-rbac-management-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, HlmButtonModule],
  template: `
    <div class="page-grid">
      <div class="card rbac-card">
        <div class="rbac-header">
          <div>
            <p class="eyebrow">Access matrix</p>
            <h3>{{ 'nav.rbac' | translate }}</h3>
            <p class="muted">Review and adjust permissions per role. Use the ? badge to see what each permission does.</p>
          </div>
          <span class="pill">{{ visibleRoles().length }} roles</span>
        </div>
        <div class="rbac-empty muted" *ngIf="!visibleRoles().length">No visible roles found.</div>
        <div class="rbac-grid" *ngIf="visibleRoles().length">
          <article class="role-card" *ngFor="let role of visibleRoles()">
            <div class="role-card__header">
              <div>
                <h4>{{ role.name }}</h4>
                <p class="role-description">{{ role.permissions.length }} permissions assigned</p>
              </div>
              <span class="pill">{{ role.permissions.length }} assigned</span>
            </div>
            <div class="permission-grid">
              <label *ngFor="let permission of permissions()" class="permission-item">
                <input
                  type="checkbox"
                  [checked]="isChecked(role.id, permission.key)"
                  (change)="togglePermission(role.id, permission.key, $any($event.target).checked)"
                />
                <button
                  type="button"
                  class="permission-help"
                  [title]="permissionDescription(permission.key)"
                  [attr.aria-label]="'Permission details for ' + permission.key"
                >
                  ?
                </button>
                <span>{{ permission.key }}</span>
              </label>
            </div>
            <div class="role-actions">
              <button hlmBtn variant="default" type="button" (click)="save(role.id)">{{ 'common.save' | translate }}</button>
            </div>
          </article>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rbac-card {
      display: grid;
      gap: 18px;
    }

    .rbac-header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .eyebrow {
      margin: 0 0 6px 0;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--brand-teal);
    }

    .rbac-card h3 {
      margin-bottom: 6px;
    }

    .rbac-grid {
      display: grid;
      gap: 16px;
    }

    .role-card {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 18px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.15));
      display: grid;
      gap: 16px;
    }

    :host-context(body.theme-dark) .role-card {
      background: linear-gradient(180deg, rgba(16, 27, 45, 0.96), rgba(16, 27, 45, 0.72));
    }

    .role-card__header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .role-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .role-title-row h4 {
      margin: 0;
      font-size: 1.2rem;
    }

    .permission-help {
      width: 26px;
      height: 26px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface-2);
      color: var(--ink-700);
      font-weight: 700;
      font-size: 0.95rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: help;
    }

    .role-description {
      margin: 6px 0 0 0;
      color: var(--ink-500);
      max-width: 66ch;
    }

    .permission-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 10px;
    }

    .permission-item {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 12px 14px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface-1);
    }

    .permission-item span {
      line-height: 1.2;
      color: var(--ink-700);
      word-break: break-word;
    }

    .role-actions {
      display: flex;
      justify-content: flex-end;
    }

    .rbac-empty {
      padding: 8px 0 2px;
    }
  `]
})
export class RbacManagementPageComponent implements OnInit {
  readonly roles = signal<RoleView[]>([]);
  readonly permissions = signal<PermissionView[]>([]);
  readonly selectedByRole = signal<Record<string, Set<string>>>({});
  readonly visibleRoles = computed(() => this.roles().filter((role) => role.name !== 'SUPER_ADMINISTRATOR'));

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.get<{ roles: RoleView[] }>('/admin/rbac/roles').subscribe((rolesResponse) => {
      this.roles.set(rolesResponse.roles);
      const map: Record<string, Set<string>> = {};
      for (const role of rolesResponse.roles) {
        map[role.id] = new Set(role.permissions);
      }
      this.selectedByRole.set(map);
    });

    this.api.get<{ permissions: PermissionView[] }>('/admin/rbac/permissions').subscribe((permissionsResponse) => {
      this.permissions.set(permissionsResponse.permissions);
    });
  }

  permissionDescription(permissionKey: string) {
    return permissionDescriptions[permissionKey] || 'No description available for this permission.';
  }

  isChecked(roleId: string, permissionKey: string) {
    return this.selectedByRole()[roleId]?.has(permissionKey) ?? false;
  }

  togglePermission(roleId: string, permissionKey: string, checked: boolean) {
    const current = this.selectedByRole();
    const clone: Record<string, Set<string>> = {};
    for (const [id, values] of Object.entries(current)) {
      clone[id] = new Set(values);
    }

    if (!clone[roleId]) {
      clone[roleId] = new Set<string>();
    }

    if (checked) {
      clone[roleId].add(permissionKey);
    } else {
      clone[roleId].delete(permissionKey);
    }

    this.selectedByRole.set(clone);
  }

  save(roleId: string) {
    const keys = Array.from(this.selectedByRole()[roleId] || []);
    if (!keys.length) {
      return;
    }

    this.api.put(`/admin/rbac/roles/${roleId}/permissions`, { permissionKeys: keys }).subscribe(() => {
      this.load();
    });
  }
}
