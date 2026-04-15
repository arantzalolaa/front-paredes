import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
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
  user: SessionUser;
}

@Injectable({
  providedIn: 'root',
})
export class AutService {
  private http = inject(HttpClient);

  private readonly storageKey = 'session_user';
  private readonly storageKeyToken = 'session_token';
  private readonly loginUrl = `${environment.apiUrl}/auth/login`;
  
  private readonly _currentUser = signal<SessionUser | null>(this.readFromStorage());

  readonly currentUser = computed(() => this._currentUser());
  readonly isAuthenticated = computed(() => this._currentUser() !== null);


  login(email: string, password: string) : Observable<SessionUser> {
    return this.http.post<LoginResponse>(this.loginUrl, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem(this.storageKey,response.token);
        localStorage.setItem(this.storageKey, JSON.stringify(response.user));
        this._currentUser.set(response.user);
    }),
      map((response) => response.user)
    );
  }

  readFromStorage() : SessionUser | null {
    const user = localStorage.getItem(this.storageKey);
    if(!user) return null;

    try {
      return JSON.parse(user) as SessionUser;
    } catch (error) {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  logout() : void {
    this._currentUser.set(null);
    localStorage.removeItem(this.storageKey);
  }
}

