import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, HlmButtonModule],
  template: `
    <div class="page-grid">
      <div class="card">
        <h3>{{ 'nav.profile' | translate }}</h3>
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="form-grid">
          <input class="input" formControlName="firstName" placeholder="Prenom" />
          <input class="input" formControlName="lastName" placeholder="Nom" />
          <input class="input" formControlName="phone" placeholder="Telephone" />
          <select class="input" formControlName="locale">
            <option value="fr">Francais</option>
            <option value="en">English</option>
          </select>
          <button hlmBtn variant="default" type="submit">{{ 'common.update' | translate }}</button>
        </form>
      </div>

      <div class="card">
        <h3>Mot de passe</h3>
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="form-grid">
          <input class="input" type="password" formControlName="currentPassword" placeholder="Mot de passe actuel" />
          <input class="input" type="password" formControlName="newPassword" placeholder="Nouveau mot de passe" />
          <button hlmBtn variant="outline" type="submit">{{ 'common.update' | translate }}</button>
        </form>
      </div>
    </div>
  `
})
export class ProfilePageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: [''],
    locale: ['fr']
  });

  readonly passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private readonly api: ApiService) {}

  ngOnInit() {
    this.api.get<{ user: any }>('/client/profile').subscribe((res) => {
      this.profileForm.patchValue(res.user);
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      return;
    }
    this.api.patch('/client/profile', this.profileForm.value).subscribe();
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      return;
    }
    this.api.post('/client/profile/change-password', this.passwordForm.value).subscribe();
  }
}
