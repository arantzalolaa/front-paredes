import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ɵInternalFormsSharedModule, ReactiveFormsModule } from "@angular/forms";
import { Login } from './pages/login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('practica5');
}
