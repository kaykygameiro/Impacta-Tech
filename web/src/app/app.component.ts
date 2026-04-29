import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tarefa, TarefaStatus, TarefaUpsert } from './models/tarefa';
import { TarefaService } from './services/tarefa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly tarefaService = inject(TarefaService);

  tarefas: Tarefa[] = [];
  form: TarefaUpsert = { titulo: '', descricao: '', status: 'Pendente' };
  editing: Tarefa | null = null;
  loading = false;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  private messageTimeoutId: ReturnType<typeof setTimeout> | null = null;
  readonly statusOptions: TarefaStatus[] = ['Pendente', 'Concluída'];

  ngOnInit(): void {
    this.loadTarefas();
  }

  handleSubmit(): void {
    if (!this.form.titulo.trim()) {
      this.showMessage('Informe o titulo da tarefa.', 'error');
      return;
    }

    const payload = this.buildPayload();

    if (this.editing) {
      this.updateTarefa(this.editing.id, payload);
      return;
    }

    this.createTarefa(payload);
  }

  handleEdit(tarefa: Tarefa): void {
    this.editing = tarefa;
    this.form = {
      titulo: tarefa.titulo,
      descricao: tarefa.descricao ?? '',
      status: tarefa.status
    };
  }

  handleCancelEdit(): void {
    this.editing = null;
    this.resetForm();
  }

  handleDelete(tarefa: Tarefa): void {
    if (!confirm('Deseja excluir esta tarefa?')) {
      return;
    }

    this.loading = true;
    this.tarefaService.delete(tarefa.id).subscribe({
      next: () => {
        this.showMessage('Tarefa excluida com sucesso!', 'success');
        this.loadTarefas();
      },
      error: () => {
        this.loading = false;
        this.showMessage('Nao foi possivel excluir a tarefa.', 'error');
      }
    });
  }

  handleToggleStatus(tarefa: Tarefa): void {
    const novoStatus: TarefaStatus = tarefa.status === 'Pendente' ? 'Concluída' : 'Pendente';

    this.updateTarefa(tarefa.id, {
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      status: novoStatus
    });
  }

  loadTarefas(): void {
    this.loading = true;
    this.tarefaService.getAll().subscribe({
      next: (tarefas) => {
        this.tarefas = tarefas;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showMessage('Nao foi possivel carregar as tarefas.', 'error');
      }
    });
  }

  formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('pt-BR');
  }

  trackById(_: number, tarefa: Tarefa): number {
    return tarefa.id;
  }

  private createTarefa(payload: TarefaUpsert): void {
    this.loading = true;
    this.tarefaService.create(payload).subscribe({
      next: () => {
        this.showMessage('Tarefa criada com sucesso!', 'success');
        this.editing = null;
        this.resetForm();
        this.loadTarefas();
      },
      error: () => {
        this.loading = false;
        this.showMessage('Nao foi possivel criar a tarefa.', 'error');
      }
    });
  }

  private updateTarefa(id: number, payload: TarefaUpsert): void {
    this.loading = true;
    this.tarefaService.update(id, payload).subscribe({
      next: () => {
        this.showMessage('Tarefa atualizada com sucesso!', 'success');
        this.editing = null;
        this.resetForm();
        this.loadTarefas();
      },
      error: () => {
        this.loading = false;
        this.showMessage('Nao foi possivel atualizar a tarefa.', 'error');
      }
    });
  }

  private buildPayload(): TarefaUpsert {
    const titulo = this.form.titulo.trim();
    const descricaoRaw = this.form.descricao ?? '';
    const descricao = descricaoRaw.toString().trim();

    return {
      titulo,
      descricao: descricao.length > 0 ? descricao : null,
      status: this.form.status
    };
  }

  private resetForm(): void {
    this.form = {
      titulo: '',
      descricao: '',
      status: 'Pendente'
    };
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;

    if (this.messageTimeoutId) {
      clearTimeout(this.messageTimeoutId);
    }

    this.messageTimeoutId = setTimeout(() => {
      this.message = null;
    }, 4000);
  }
}
