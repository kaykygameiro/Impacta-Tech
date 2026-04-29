import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Tarefa, TarefaUpsert } from '../models/tarefa';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5066/api/tarefas';

  getAll(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.baseUrl);
  }

  create(payload: TarefaUpsert): Observable<Tarefa> {
    return this.http.post<Tarefa>(this.baseUrl, payload);
  }

  update(id: number, payload: TarefaUpsert): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
