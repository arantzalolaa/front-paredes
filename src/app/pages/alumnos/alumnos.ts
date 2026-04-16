import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { finalize, timeout } from 'rxjs';
import { AlumnoPayload, AlumnoRecord, AlumnosService } from '../../services/alumnos.service';

interface AlumnoRow {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  carrera: string;
  semestre: string;
  correo: string;
}

@Component({
  selector: 'app-alumnos',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.scss',
})
export class Alumnos implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly alumnosService = inject(AlumnosService);

  @ViewChild(FormGroupDirective) formDirective?: FormGroupDirective;

  readonly displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'matricula',
    'carrera',
    'semestre',
    'correo',
    'acciones',
  ];

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    matricula: ['', Validators.required],
    carrera: ['', Validators.required],
    semestre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
  });

  alumnosRegistrados: AlumnoRow[] = [];
  loading = false;
  submitting = false;
  errorMessage = '';
  private editingId: number | null = null;

  ngOnInit(): void {
    this.loadAlumnos();
  }

  loadAlumnos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.alumnosService
      .getAll()
      .pipe(timeout(8000), finalize(() => (this.loading = false)))
      .subscribe({
        next: (rows) => {
          this.alumnosRegistrados = rows.map((row) => this.toUiRow(row));
        },
        error: () => {
          this.errorMessage = 'No se pudieron cargar los alumnos desde la base de datos.';
        },
      });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.toPayload();
    const request$ = this.editingId
      ? this.alumnosService.update(this.editingId, payload)
      : this.alumnosService.create(payload);

    this.submitting = true;
    request$.pipe(finalize(() => (this.submitting = false))).subscribe({
      next: () => {
        this.clear();
        this.loadAlumnos();
      },
      error: () => {
        this.errorMessage = this.editingId
          ? 'No se pudo actualizar el alumno.'
          : 'No se pudo guardar el alumno.';
      },
    });
  }

  edit(alumno: AlumnoRow): void {
    this.editingId = alumno.id;
    this.form.patchValue({
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      matricula: alumno.matricula,
      carrera: alumno.carrera,
      semestre: alumno.semestre,
      correo: alumno.correo,
    });
  }

  remove(alumno: AlumnoRow): void {
    this.alumnosService.delete(alumno.id).subscribe({
      next: () => {
        if (this.editingId === alumno.id) {
          this.clear();
        }
        this.loadAlumnos();
      },
      error: () => {
        this.errorMessage = 'No se pudo eliminar el alumno.';
      },
    });
  }

  clear(): void {
    this.editingId = null;
    const emptyForm = {
      nombre: '',
      apellido: '',
      matricula: '',
      carrera: '',
      semestre: '',
      correo: '',
    };

    this.form.reset(emptyForm);
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.formDirective?.resetForm(emptyForm);
  }

  get isEditing(): boolean {
    return this.editingId !== null;
  }

  private toPayload(): AlumnoPayload {
    const value = this.form.getRawValue();

    return {
      id: this.editingId ?? this.getNextId(),
      nombre: value.nombre.trim(),
      apellido: value.apellido.trim(),
      matricula: value.matricula.trim(),
      carrera: value.carrera.trim(),
      semestre: value.semestre.trim(),
      correo: value.correo.trim(),
    };
  }

  private getNextId(): number {
    if (this.alumnosRegistrados.length === 0) {
      return 1;
    }

    return Math.max(...this.alumnosRegistrados.map((item) => item.id)) + 1;
  }

  private toUiRow(row: AlumnoRecord): AlumnoRow {
    return {
      id: Number(row.id),
      nombre: row.nombre,
      apellido: row.apellido,
      matricula: row.matricula,
      carrera: row.carrera,
      semestre: row.semestre,
      correo: row.correo,
    };
  }
}