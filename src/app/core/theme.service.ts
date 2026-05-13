import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'myb_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<'light' | 'dark'>('light');

  readonly theme = this._theme.asReadonly();

  constructor() {
    const saved = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    if (saved) {
      this.setTheme(saved);
    } else {
      this.setTheme('light');
    }
  }

  toggle() {
    this.setTheme(this._theme() === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: 'light' | 'dark') {
    this._theme.set(theme);
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem(THEME_KEY, theme);
  }
}
