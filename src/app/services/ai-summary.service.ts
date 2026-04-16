import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface AiResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiSummaryService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/ai/chat`;

  summarize(entityType: 'alumno' | 'maestro', values: Record<string, string | number>): Observable<string> {
    const prompt = this.buildPrompt(entityType, values);

    return this.http
      .post<AiResponse>(this.url, { prompt })
      .pipe(map((response) => response.reply?.trim() || 'No se pudo generar un resumen.'));
  }

  private buildPrompt(entityType: 'alumno' | 'maestro', values: Record<string, string | number>): string {
    const detail = Object.entries(values)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n');

    return `Eres un asistente académico. Resume en máximo 4 líneas la información de este ${entityType}, destacando datos clave de forma clara y formal.\n\n${detail}`;
  }
}