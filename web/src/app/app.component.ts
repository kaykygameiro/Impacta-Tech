import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { Tarefa, TarefaUpsert } from './models/tarefa';
import { TarefaService } from './services/tarefa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly tarefaService = inject(TarefaService);

  tarefas: Tarefa[] = [];
  selected: Tarefa | null = null;
  loading = false;
  message: string | null = null;
  messageType: 'success' | 'error' = 'success';
  private messageTimeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.loadTarefas();
  }

  handleSave(payload: TarefaUpsert): void {
    if (this.selected) {
      this.updateTarefa(this.selected.id, payload);
      return;
    }

    this.createTarefa(payload);
  }

  handleEdit(tarefa: Tarefa): void {
    this.selected = tarefa;
  }

  handleCancelEdit(): void {
    this.selected = null;
  }

  handleDelete(id: number): void {
    this.loading = true;
    this.tarefaService.delete(id).subscribe({
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
    const novoStatus = tarefa.status === 'Pendente' ? 'Concluida' : 'Pendente';

    this.updateTarefa(tarefa.id, {
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      status: novoStatus
    });
  }

  private loadTarefas(): void {
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

  private createTarefa(payload: TarefaUpsert): void {
    this.loading = true;
    this.tarefaService.create(payload).subscribe({
      next: () => {
        this.showMessage('Tarefa criada com sucesso!', 'success');
        this.selected = null;
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
        this.selected = null;
        this.loadTarefas();
      },
      error: () => {
        this.loading = false;
        this.showMessage('Nao foi possivel atualizar a tarefa.', 'error');
      }
    });
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
