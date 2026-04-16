import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

interface MaestroApiRecord {
  id: number | string;
  nombre: string | null;
  apellido: string | null;
  numemp?: string | null;
  numeroEmpleado?: string | null;
  numero_empleado?: string | null;
  departamento: string | null;
  correo?: string | null;
  correoElectronico?: string | null;
  correo_electronico?: string | null;
}

export interface MaestroRecord {
  id: number;
  nombre: string;
  apellido: string;
  numeroEmpleado: string;
  departamento: string;
  correoElectronico: string;
}

export interface MaestroPayload {
  id?: number;
  nombre: string;
  apellido: string;
  numeroEmpleado: string;
  departamento: string;
  correoElectronico: string;
}

@Injectable({
  providedIn: 'root',
})
export class MaestrosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/maestros`;

  getAll(): Observable<MaestroRecord[]> {
    return this.http
      .get<MaestroApiRecord[]>(this.url)
      .pipe(map((rows) => rows.map((row) => this.normalize(row))));
  }

  create(payload: MaestroPayload): Observable<MaestroRecord> {
    return this.http
      .post<MaestroApiRecord>(this.url, this.toApiPayload(payload))
      .pipe(map((row) => this.normalize(row)));
  }

  update(id: number, payload: MaestroPayload): Observable<MaestroRecord> {
    return this.http
      .put<MaestroApiRecord>(`${this.url}/${id}`, this.toApiPayload(payload))
      .pipe(map((row) => this.normalize(row)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  private toApiPayload(payload: MaestroPayload): object {
    return {
      ...(payload.id !== undefined ? { id: payload.id } : {}),
      nombre: payload.nombre,
      apellido: payload.apellido,
      departamento: payload.departamento,
      numemp: payload.numeroEmpleado,
      numeroEmpleado: payload.numeroEmpleado,
      numero_empleado: payload.numeroEmpleado,
      correo: payload.correoElectronico,
      correoElectronico: payload.correoElectronico,
      correo_electronico: payload.correoElectronico,
    };
  }

  private normalize(row: MaestroApiRecord): MaestroRecord {
    return {
      id: Number(row.id),
      nombre: row.nombre ?? '',
      apellido: row.apellido ?? '',
      numeroEmpleado: row.numemp ?? row.numeroEmpleado ?? row.numero_empleado ?? '',
      departamento: row.departamento ?? '',
      correoElectronico: row.correo ?? row.correoElectronico ?? row.correo_electronico ?? '',
    };
  }
}