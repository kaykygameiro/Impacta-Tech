export type TarefaStatus = 'Pendente' | 'Concluída';

export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string | null;
  status: TarefaStatus;
  dataCriacao: string;
}

export interface TarefaUpsert {
  titulo: string;
  descricao: string | null;
  status: TarefaStatus;
}
