import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

export interface SessionUser {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  message: string;
  user?: SessionUser;
}

@Injectable({
  providedIn: 'root',
})
export class AutService {
  private http = inject(HttpClient);

  private readonly storageKeyUser = 'session_user';
  private readonly storageKeyToken = 'session_token';
  private readonly loginUrl = `${environment.apiUrl}/auth/login`;

  private readonly _currentUser = signal<SessionUser | null>(this.readFromStorage());

  readonly currentUser = computed(() => this._currentUser());
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  login(email: string, password: string): Observable<SessionUser> {
    return this.http.post<LoginResponse>(this.loginUrl, { email, password }).pipe(
      tap((response) => {
        const fallbackName = email.split('@')[0] || 'Usuario';
        const user: SessionUser = response.user ?? {
          id: 0,
          name: fallbackName,
          email,
        };

        localStorage.setItem(this.storageKeyToken, response.token);
        localStorage.setItem(this.storageKeyUser, JSON.stringify(user));
        this._currentUser.set(user);
      }),
      map((response) =>
        response.user ?? {
          id: 0,
          name: email.split('@')[0] || 'Usuario',
          email,
        }
      )
    );
  }

  readFromStorage(): SessionUser | null {
    const user = localStorage.getItem(this.storageKeyUser);
    if (!user) return null;

    try {
      return JSON.parse(user) as SessionUser;
    } catch {
      localStorage.removeItem(this.storageKeyUser);
      return null;
    }
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem(this.storageKeyUser);
    localStorage.removeItem(this.storageKeyToken);
  }
}