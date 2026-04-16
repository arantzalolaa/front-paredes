import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

interface AlumnoApiRecord {
  id: number | string;
  nombre: string | null;
  apellido: string | null;
  matricula: string | null;
  carrera: string | null;
  semestre: string | number | null;
  correo?: string | null;
  correo_electronico?: string | null;
}

export interface AlumnoRecord {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  carrera: string;
  semestre: string;
  correo: string;
}

export interface AlumnoPayload {
  id?: number;
  nombre: string;
  apellido: string;
  matricula: string;
  carrera: string;
  semestre: string;
  correo: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/alumnos`;

  getAll(): Observable<AlumnoRecord[]> {
    return this.http
      .get<AlumnoApiRecord[]>(this.url)
      .pipe(map((rows) => rows.map((row) => this.normalize(row))));
  }

  create(payload: AlumnoPayload): Observable<AlumnoRecord> {
    return this.http
      .post<AlumnoApiRecord>(this.url, this.toApiPayload(payload))
      .pipe(map((row) => this.normalize(row)));
  }

  update(id: number, payload: AlumnoPayload): Observable<AlumnoRecord> {
    return this.http
      .put<AlumnoApiRecord>(`${this.url}/${id}`, this.toApiPayload(payload))
      .pipe(map((row) => this.normalize(row)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  private toApiPayload(payload: AlumnoPayload): object {
    return {
      ...(payload.id !== undefined ? { id: payload.id } : {}),
      nombre: payload.nombre,
      apellido: payload.apellido,
      matricula: payload.matricula,
      carrera: payload.carrera,
      semestre: payload.semestre,
      correo: payload.correo,
      correo_electronico: payload.correo,
    };
  }

  private normalize(row: AlumnoApiRecord): AlumnoRecord {
    return {
      id: Number(row.id),
      nombre: row.nombre ?? '',
      apellido: row.apellido ?? '',
      matricula: row.matricula ?? '',
      carrera: row.carrera ?? '',
      semestre: String(row.semestre ?? ''),
      correo: row.correo ?? row.correo_electronico ?? '',
    };
  }
}