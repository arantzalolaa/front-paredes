import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { finalize, timeout } from 'rxjs';
import { AiSummaryDialog } from '../../shared/ai-summary-dialog/ai-summary-dialog';
import { AiSummaryService } from '../../services/ai-summary.service';
import { MaestrosService, MaestroPayload, MaestroRecord } from '../../services/maestros.service';

interface MaestroRow {
  id: number;
  nombre: string;
  apellido: string;
  numeroEmpleado: string;
  departamento: string;
  correoElectronico: string;
}

@Component({
  selector: 'app-maestros',
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
  templateUrl: './maestros.html',
  styleUrl: './maestros.scss',
})
export class Maestros implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly maestrosService = inject(MaestrosService);
  private readonly aiSummaryService = inject(AiSummaryService);
  private readonly dialog = inject(MatDialog);

  @ViewChild(FormGroupDirective) formDirective?: FormGroupDirective;

  readonly displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'numeroEmpleado',
    'departamento',
    'correoElectronico',
    'acciones',
  ];

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    numeroEmpleado: ['', Validators.required],
    departamento: ['', Validators.required],
    correoElectronico: ['', [Validators.required, Validators.email]],
  });

  maestrosRegistrados: MaestroRow[] = [];
  loading = false;
  submitting = false;
  errorMessage = '';
  initializing = true;
  initialLoadError = '';
  summarizingId: number | null = null;
  private editingId: number | null = null;

  ngOnInit(): void {
    this.loadMaestros(true);
  }

  retryInitialLoad(): void {
    this.loadMaestros(true);
  }

  loadMaestros(isInitialLoad = false): void {
    if (isInitialLoad) {
      this.initializing = true;
      this.initialLoadError = '';
    }

    this.loading = true;
    this.errorMessage = '';

    this.maestrosService
      .getAll()
      .pipe(timeout(8000), finalize(() => (this.loading = false)))
      .subscribe({
        next: (rows) => {
          this.maestrosRegistrados = rows.map((row) => this.toUiRow(row));
          this.initializing = false;
        },
        error: () => {
          if (isInitialLoad) {
            this.initializing = false;
            this.initialLoadError =
              'No se pudo conectar con la base de datos. Intenta nuevamente.';
            return;
          }

          this.errorMessage = 'No se pudieron cargar los maestros desde la base de datos.';
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
      ? this.maestrosService.update(this.editingId, payload)
      : this.maestrosService.create(payload);

    this.submitting = true;
    request$.pipe(finalize(() => (this.submitting = false))).subscribe({
      next: () => {
        this.clear();
        this.loadMaestros();
      },
      error: () => {
        this.errorMessage = this.editingId
          ? 'No se pudo actualizar el maestro.'
          : 'No se pudo guardar el maestro.';
      },
    });
  }

  summarize(maestro: MaestroRow): void {
    this.summarizingId = maestro.id;

    this.aiSummaryService
      .summarize('maestro', {
        id: maestro.id,
        nombre: maestro.nombre,
        apellido: maestro.apellido,
        numeroEmpleado: maestro.numeroEmpleado,
        departamento: maestro.departamento,
        correo: maestro.correoElectronico,
      })
      .pipe(finalize(() => (this.summarizingId = null)))
      .subscribe({
        next: (summary) => {
          this.dialog.open(AiSummaryDialog, {
            data: {
              title: `Resumen IA: ${maestro.nombre} ${maestro.apellido}`,
              summary,
            },
          });
        },
        error: () => {
          this.dialog.open(AiSummaryDialog, {
            data: {
              title: `Resumen IA: ${maestro.nombre} ${maestro.apellido}`,
              summary: 'No se pudo generar el resumen en este momento.',
            },
          });
        },
      });
  }

  edit(maestro: MaestroRow): void {
    this.editingId = maestro.id;
    this.form.patchValue({
      nombre: maestro.nombre,
      apellido: maestro.apellido,
      numeroEmpleado: maestro.numeroEmpleado,
      departamento: maestro.departamento,
      correoElectronico: maestro.correoElectronico,
    });
  }

  remove(maestro: MaestroRow): void {
    this.maestrosService.delete(maestro.id).subscribe({
      next: () => {
        if (this.editingId === maestro.id) {
          this.clear();
        }
        this.loadMaestros();
      },
      error: () => {
        this.errorMessage = 'No se pudo eliminar el maestro.';
      },
    });
  }

  clear(): void {
    this.editingId = null;
    const emptyForm = {
      nombre: '',
      apellido: '',
      numeroEmpleado: '',
      departamento: '',
      correoElectronico: '',
    };

    this.form.reset(emptyForm);
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.formDirective?.resetForm(emptyForm);
  }

  get isEditing(): boolean {
    return this.editingId !== null;
  }

  private toPayload(): MaestroPayload {
    const value = this.form.getRawValue();

    return {
      id: this.editingId ?? this.getNextId(),
      nombre: value.nombre.trim(),
      apellido: value.apellido.trim(),
      numeroEmpleado: value.numeroEmpleado.trim(),
      departamento: value.departamento.trim(),
      correoElectronico: value.correoElectronico.trim(),
    };
  }

  private getNextId(): number {
    if (this.maestrosRegistrados.length === 0) {
      return 1;
    }

    return Math.max(...this.maestrosRegistrados.map((item) => item.id)) + 1;
  }

  private toUiRow(row: MaestroRecord): MaestroRow {
    return {
      id: Number(row.id),
      nombre: row.nombre,
      apellido: row.apellido,
      numeroEmpleado: row.numeroEmpleado,
      departamento: row.departamento,
      correoElectronico: row.correoElectronico,
    };
  }
}