import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from './config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(path: string, params?: Record<string, string | number | boolean>) {
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    return this.http.get<T>(`${API_BASE_URL}${path}`, { params: httpParams });
  }

  post<T>(path: string, body?: unknown) {
    return this.http.post<T>(`${API_BASE_URL}${path}`, body ?? {});
  }

  patch<T>(path: string, body?: unknown) {
    return this.http.patch<T>(`${API_BASE_URL}${path}`, body ?? {});
  }

  put<T>(path: string, body?: unknown) {
    return this.http.put<T>(`${API_BASE_URL}${path}`, body ?? {});
  }

  delete<T>(path: string) {
    return this.http.delete<T>(`${API_BASE_URL}${path}`);
  }
}
