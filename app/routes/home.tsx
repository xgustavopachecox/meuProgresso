import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import AddTaskModal from '../components/AddTaskModal';
import { 
  LuPlus, LuDumbbell, LuUtensils, LuWallet, 
  LuCheck, LuCircle, LuArrowRight, LuActivity
} from 'react-icons/lu';
import api from '../services/api'; // <-- Importando nossa conexão com o Java

// --- DADOS SIMULADOS (Ainda fixos por enquanto) ---
const MOCK_USER = { name: "Gustavo" };
const SUMMARY_DATA = {
  nextWorkout: "Upper A",
  calories: { current: 1200, total: 3200 },
  balance: 150.00
};
const HABIT_HISTORY = [
  { day: 'D', score: 100 }, { day: 'S', score: 80 }, { day: 'T', score: 100 },
  { day: 'Q', score: 60 }, { day: 'Q', score: 0 }, { day: 'S', score: 0 }, { day: 'S', score: 0 },
];

// Tipo da Tarefa (igual ao do Java)
interface Task {
  id: number;
  description: string;
  done: boolean;
}

export default function HomePage() {
  // Começa vazio, pois vai carregar do banco
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 1. CARREGAR TAREFAS DO BANCO (GET) ---
  useEffect(() => {
    api.get('/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => console.error("Erro ao buscar tarefas:", error));
  }, []);

  // --- 2. CRIAR TAREFA NO BANCO (POST) ---
  const handleAddTask = (taskData: { description: string }) => {
    const newTask = { description: taskData.description, done: false };
    
    api.post('/tasks', newTask)
      .then(response => {
        // Adiciona a tarefa criada (que vem com ID do banco) na lista
        setTasks([response.data, ...tasks]);
        setIsModalOpen(false);
      })
      .catch(error => console.error("Erro ao salvar tarefa:", error));
  };

  // --- 3. ATUALIZAR NO BANCO (PUT) ---
  const toggleTask = (task: Task) => {
    // Atualiza visualmente na hora (otimista)
    const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t);
    setTasks(updatedTasks);

    // Manda pro banco
    api.put(`/tasks/${task.id}`, { ...task, done: !task.done })
      .catch(error => {
        console.error("Erro ao atualizar:", error);
        // Se der erro, desfaz a mudança visualmente (opcional)
      });
  };

  // --- 4. DELETAR DO BANCO (DELETE) ---
  const handleDeleteTask = (id: number) => {
    if(confirm("Remover tarefa?")) {
      // Remove visualmente
      setTasks(tasks.filter(t => t.id !== id));
      
      // Remove do banco
      api.delete(`/tasks/${id}`)
        .catch(error => console.error("Erro ao deletar:", error));
    }
  };

  // Cálculos Visuais
  const calPercentage = Math.min((SUMMARY_DATA.calories.current / SUMMARY_DATA.calories.total) * 100, 100);
  const tasksDone = tasks.filter(t => t.done).length;
  const tasksTotal = tasks.length;
  const tasksPercentage = tasksTotal === 0 ? 0 : Math.round((tasksDone / tasksTotal) * 100);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="page-container home-container">
      
      <header className="home-header">
        <div>
          <h1 className="greeting">{greeting}, <span className="user-name">{MOCK_USER.name}</span></h1>
          <p className="subtitle">Vamos fazer hoje render!</p>
        </div>
        <div className="header-date">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </header>

      <div className="summary-grid">
        <Link to="/treino" className="summary-card workout-card">
          <div className="card-icon-bg blue"><LuDumbbell size={24} /></div>
          <div className="card-content">
            <span className="card-label">Próximo Treino</span>
            <h3 className="card-value">{SUMMARY_DATA.nextWorkout}</h3>
          </div>
          <div className="card-arrow"><LuArrowRight /></div>
        </Link>

        <Link to="/dieta" className="summary-card diet-card">
          <div className="card-icon-bg orange"><LuUtensils size={24} /></div>
          <div className="card-content">
            <span className="card-label">Calorias (Hoje)</span>
            <div className="diet-progress-row">
              <h3 className="card-value">{SUMMARY_DATA.calories.current} <span className="unit">kcal</span></h3>
              <div className="mini-progress-bar">
                <div className="mini-fill" style={{ width: `${calPercentage}%` }}></div>
              </div>
            </div>
          </div>
          <div className="card-arrow"><LuArrowRight /></div>
        </Link>

        <Link to="/financeiro" className="summary-card finance-card">
          <div className="card-icon-bg green"><LuWallet size={24} /></div>
          <div className="card-content">
            <span className="card-label">Saldo Livre</span>
            <h3 className="card-value">R$ {SUMMARY_DATA.balance.toFixed(2)}</h3>
          </div>
          <div className="card-arrow"><LuArrowRight /></div>
        </Link>
      </div>

      <div className="home-main-layout">
        
        <div className="left-section">
          <div className="widget consistency-widget">
            <div className="widget-header">
              <h3><LuActivity /> Consistência Semanal</h3>
              <span className="score-badge">85% Focado</span>
            </div>
            <div className="consistency-chart">
              {HABIT_HISTORY.map((day, i) => (
                <div key={i} className="day-col">
                  <div className="day-bar-bg">
                    <div 
                      className="day-bar-fill" 
                      style={{ height: `${day.score}%`, opacity: day.score ? 1 : 0.3 }}
                    ></div>
                  </div>
                  <span className="day-letter">{day.day}</span>
                </div>
              ))}
            </div>
            <p className="consistency-tip">Você está mandando bem! Mantenha o ritmo nos estudos hoje.</p>
          </div>
        </div>

        <div className="right-section">
          <div className="widget tasks-home-widget">
            <div className="widget-header">
              <h3>Tarefas de Hoje</h3>
              <span className="tasks-count">{tasksDone}/{tasksTotal}</span>
            </div>
            
            <div className="tasks-progress-bar">
              <div className="tasks-fill" style={{ width: `${tasksPercentage}%` }}></div>
            </div>

            <ul className="home-tasks-list">
              {tasks.map(task => (
                <li key={task.id} className={`home-task-item ${task.done ? 'done' : ''}`} onClick={() => toggleTask(task)}>
                  {task.done ? <LuCheck className="check-icon done" /> : <LuCircle className="check-icon" />}
                  <span className="task-text">{task.description}</span>
                </li>
              ))}
              {tasks.length === 0 && <p className="empty-tasks">Nenhuma tarefa para hoje.</p>}
            </ul>

            <button className="btn-add-task-home" onClick={() => setIsModalOpen(true)}>
              <LuPlus /> Nova Tarefa
            </button>
          </div>
        </div>

      </div>

      <AddTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask} 
        taskToEdit={null}
      />
    </div>
  );
}