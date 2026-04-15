import { Component, inject } from '@angular/core';
import { AutService } from '../../services/aut-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly auth = inject(AutService);
  protected readonly router = inject(Router);

  logout() : void{
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
