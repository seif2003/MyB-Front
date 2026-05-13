import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { ApiService } from '../../core/api.service';

interface RoleOption {
  id: string;
  name: string;
}

interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  locale: string;
  roles: string[];
  createdAt: string;
}

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, HlmButtonModule],
  template: `
    <div class="page-grid">
      <div class="card">
        <h3>{{ 'admin.userCreate' | translate }}</h3>
        <form [formGroup]="createForm" (ngSubmit)="createUser()" class="form-grid">
          <input class="input" formControlName="email" type="email" placeholder="Email" />
          <input class="input" formControlName="password" type="password" placeholder="Password" />
          <input class="input" formControlName="firstName" placeholder="First name" />
          <input class="input" formControlName="lastName" placeholder="Last name" />
          <select class="input" formControlName="role">
            <option *ngFor="let role of roles()" [value]="role.name">{{ role.name }}</option>
          </select>
          <select class="input" formControlName="locale">
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
          <button class="btn btn-primary" type="submit" [disabled]="createForm.invalid">
            {{ 'common.create' | translate }}
          </button>
        </form>
      </div>

      <div class="card">
        <h3>{{ 'nav.users' | translate }}</h3>
        <table class="table" *ngIf="users().length">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>{{ 'common.status' | translate }}</th>
              <th>{{ 'common.actions' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users()">
              <td>{{ user.email }}</td>
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>
                <div class="role-list">
                  <span class="pill" *ngFor="let role of user.roles">{{ role }}</span>
                  <span class="muted" *ngIf="!user.roles.length">No role</span>
                </div>
                <select
                  class="input"
                  value=""
                  (change)="updateRole(user.id, $any($event.target).value)"
                >
                  <option value="">Change role</option>
                  <option *ngFor="let role of roles()" [value]="role.name">{{ role.name }}</option>
                </select>
              </td>
              <td><span class="pill">{{ user.status }}</span></td>
              <td>
                <div class="inline-actions">
                <button class="btn btn-primary btn-sm" type="button" (click)="updateStatus(user.id, 'ACTIVE')" [disabled]="user.status === 'ACTIVE'">
                  Active
                </button>
                <button class="btn btn-secondary btn-sm" type="button" (click)="updateStatus(user.id, 'SUSPENDED')" [disabled]="user.status === 'SUSPENDED'">
                  Suspend
                </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class UserManagementPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly users = signal<UserItem[]>([]);
  readonly roles = signal<RoleOption[]>([]);

  readonly createForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    role: ['CLIENT', Validators.required],
    locale: ['fr', Validators.required]
  });

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles() {
    this.api.get<{ roles: RoleOption[] }>('/admin/rbac/roles').subscribe((response) => {
      this.roles.set(response.roles);
      if (response.roles.length && !response.roles.some((role) => role.name === this.createForm.value.role)) {
        this.createForm.patchValue({ role: response.roles[0].name });
      }
    });
  }

  loadUsers() {
    this.api.get<{ items: UserItem[] }>('/admin/users', { page: 1, pageSize: 100 }).subscribe((response) => {
      this.users.set(response.items);
    });
  }

  createUser() {
    if (this.createForm.invalid) {
      return;
    }

    const value = this.createForm.getRawValue();
    this.api
      .post('/admin/users', {
        email: value.email,
        password: value.password,
        firstName: value.firstName,
        lastName: value.lastName,
        roles: [value.role],
        locale: value.locale
      })
      .subscribe(() => {
        this.createForm.patchValue({ password: '' });
        this.loadUsers();
      });
  }

  updateStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED') {
    this.api.patch(`/admin/users/${userId}`, { status }).subscribe(() => this.loadUsers());
  }

  updateRole(userId: string, roleName: string) {
    if (!roleName) {
      return;
    }
    this.api.patch(`/admin/users/${userId}`, { roles: [roleName] }).subscribe(() => this.loadUsers());
  }
}
