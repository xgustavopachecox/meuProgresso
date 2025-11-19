import { useState, useEffect } from 'react';
import './home.css';
import AddTaskModal from '../components/AddTaskModal';
import { LuPencil, LuTrash2 } from 'react-icons/lu';

// Interface para o objeto de tarefa
interface Task {
  id: number;
  description: string;
  done: boolean;
}

// --- DADOS SIMULADOS (MOCK) ---
const MOCK_TASKS: Task[] = [
  { id: 1, description: 'Comprar Whey Protein', done: false },
  { id: 2, description: 'Revisar aula de Hooks', done: true },
  { id: 3, description: 'Pagar boleto da academia', done: false },
];

const MOCK_STATS = {
  diasCertos: 15,
  totalMes: 31,
  treinosNoMes: 12,
  horasEstudo: 40,
  tarefasConcluidas: 23,
};
// ---------------------------------

export default function HomePage() {
  // --- ESTADOS (STATES) ---
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [stats, setStats] = useState(MOCK_STATS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  // --- FUNÇÕES DE CONTROLE DO MODAL ---

  // Abre o modal em modo "Adicionar"
  const openAddTaskModal = () => {
    setTaskToEdit(null); // Limpa o estado de edição
    setIsTaskModalOpen(true);
  };

  // Abre o modal em modo "Editar"
  const openEditTaskModal = (task: Task) => {
    setTaskToEdit(task); // Define qual tarefa estamos editando
    setIsTaskModalOpen(true);
  };

  // Fecha o modal
  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskToEdit(null); // Limpa o estado de edição ao fechar
  };

  // --- FUNÇÕES DE LÓGICA DAS TAREFAS ---

  // Função única que ADICIONA ou EDITA
  const handleModalSubmit = (taskData: { description: string; id?: number }) => {
    if (taskData.id) {
      // É UMA EDIÇÃO (porque tem ID)
      setTasks(
        tasks.map(t =>
          t.id === taskData.id ? { ...t, description: taskData.description } : t
        )
      );
    } else {
      // É UMA ADIÇÃO (porque não tem ID)
      const newTask: Task = {
        id: Date.now(), // ID simples baseado no tempo
        description: taskData.description,
        done: false,
      };
      setTasks([newTask, ...tasks]); // Adiciona no topo da lista
    }

    closeTaskModal(); // Fecha o modal após o sucesso
  };

  // REMOVE uma tarefa
  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // MARCA uma tarefa como feita/não feita
  const toggleTask = (taskId: number) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );
  };
  
  return (
    <div className="dashboard-page-container">
      <header className="dashboard-header">
        <h1>Meu Progresso</h1>
        <p>Visão Geral de Outubro, 2025</p>
      </header>

      {/* GRID DE ESTATÍSTICAS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.diasCertos} / {stats.totalMes}</div>
          <div className="stat-label">Dias em Conformidade</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.treinosNoMes}</div>
          <div className="stat-label">Treinos no Mês</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.horasEstudo}h</div>
          <div className="stat-label">Horas de Estudo</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.tarefasConcluidas}</div>
          <div className="stat-label">Tarefas Concluídas</div>
        </div>
      </div>

      {/* LAYOUT DE DUAS COLUNAS */}
      <div className="dashboard-main-layout">
        <div className="main-column">
          <div className="reports-section">
            <button className="btn-report">Relatório Semanal</button>
            <button className="btn-report">Relatório Mensal</button>
          </div>
          <div className="chart-placeholder">
            <p>(Em breve: Gráfico de Progresso Semanal)</p>
          </div>
        </div>

        <div className="side-column">
          {/* WIDGET DE TAREFAS */}
          <div className="tasks-widget">
            <h3 className="widget-title">Tarefas de Hoje</h3>
            <ul className="tasks-list">
              
              {tasks.map(task => (
                <li key={task.id} className="task-item">
                  
                  {/* Parte clicável (checkbox e texto) */}
                  <div className="task-content" onClick={() => toggleTask(task.id)}>
                    <div className={`task-checkbox ${task.done ? 'done' : ''}`}>
                      {task.done && '✔'}
                    </div>
                    <span className={`task-description ${task.done ? 'done' : ''}`}>
                      {task.description}
                    </span>
                  </div>

                  {/* Botões de Ação */}
                  <div className="task-actions">
                    <button 
                      className="task-action-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // Impede o clique de marcar/desmarcar
                        openEditTaskModal(task); 
                      }}
                    >
                      <LuPencil size={16} />
                    </button>
                    <button 
                      className="task-action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {tasks.length === 0 && <p className="no-tasks">Nenhuma tarefa para hoje.</p>}
            
            <button 
              className="btn-add-task-widget" 
              onClick={openAddTaskModal} // Abre o modal em modo "Adicionar"
            >
              + Adicionar Tarefa
            </button>
          </div>
        </div>
      </div>

      {/* BOTÃO FLUTUANTE (FAB) */}
      <button className="fab" onClick={openAddTaskModal}>+</button>
      
      {/* MODAL (agora reutilizável) */}
      <AddTaskModal 
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        onSubmit={handleModalSubmit}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}