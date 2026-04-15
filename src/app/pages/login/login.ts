import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutService } from '../../services/aut-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AutService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  showPassword = false;
  authError: string | null = null;

  get emailControl() {
    return this.form.controls.email;
  }

  get passwordControl() {
    return this.form.controls.password;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    console.log(this.form.value);
    const { email, password } = this.form.value;

    this.auth.login(email!, password!)
    .subscribe({
      next: () => this.router.navigate(['/home']),
      error: (error: HttpErrorResponse) => {
        console.log(error);
        console.log(error.status);
      }
    });
    //this.authError = 'Credenciales inválidas. Verifica tu correo y contraseña.';
  }
}
