import { computed, Injectable, signal } from '@angular/core';

export interface SessionUser {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AutService {
  mockedUsers: any[] = [
    { id: 1, name: 'Jose', email: 'admin@demo.com', password: '123456' },
    { id: 2, name: 'Paola', email: 'user@demo.com', password: 'abcdef' }
  ];

  private readonly storageKey = 'session_user';

  private readonly _currentUser = signal<SessionUser | null>(this.readFromStorage());

  readonly currentUser = computed(() => this._currentUser());
  readonly isAuthenticated = computed(() => this._currentUser() !== null);


  login(email: string, password: string) : boolean {
    const existe = this.mockedUsers.find(
      u => u.email.toLowerCase() === email.toLocaleLowerCase().trim() &&
        u.password.toLowerCase() === password.toLocaleLowerCase().trim()
    );

    if(!existe) return false;

    const sessionUser : SessionUser = {
      id: existe.id,
      name: existe.name,
      email: existe.email
    };

    localStorage.setItem(this.storageKey, JSON.stringify(sessionUser));

    this._currentUser.set(sessionUser);

    return true;
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

