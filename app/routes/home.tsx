import { useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import AddTaskModal from '../components/AddTaskModal';
import { 
  LuPlus, LuDumbbell, LuUtensils, LuWallet, 
  LuCheck, LuCircle, LuArrowRight, LuActivity
} from 'react-icons/lu';

// --- DADOS SIMULADOS DO DASHBOARD ---
const MOCK_USER = { name: "Gustavo" };

const SUMMARY_DATA = {
  nextWorkout: "Upper A",
  calories: { current: 1200, total: 3200 },
  balance: 150.00 // Saldo livre do dia/mês
};

const MOCK_TASKS = [
  { id: 1, description: 'Comprar Whey Protein', done: false },
  { id: 2, description: 'Revisar aula de Hooks', done: true },
  { id: 3, description: 'Pagar boleto da academia', done: false },
  { id: 4, description: 'Ler 10 páginas', done: false },
];

// Dados para o gráfico de consistência (últimos 7 dias)
const HABIT_HISTORY = [
  { day: 'D', score: 100 },
  { day: 'S', score: 80 },
  { day: 'T', score: 100 },
  { day: 'Q', score: 60 }, // Hoje
  { day: 'Q', score: 0 },
  { day: 'S', score: 0 },
  { day: 'S', score: 0 },
];

export default function HomePage() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Lógica de Tarefas ---
  const handleAddTask = (taskData: { description: string }) => {
    const newTask = { id: Date.now(), description: taskData.description, done: false };
    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleDeleteTask = (id: number) => {
    if(confirm("Remover tarefa?")) setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Cálculos de Progresso
  const calPercentage = Math.min((SUMMARY_DATA.calories.current / SUMMARY_DATA.calories.total) * 100, 100);
  const tasksDone = tasks.filter(t => t.done).length;
  const tasksTotal = tasks.length;
  const tasksPercentage = tasksTotal === 0 ? 0 : Math.round((tasksDone / tasksTotal) * 100);

  // Saudação baseada no horário
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="page-container home-container">
      
      {/* 1. HEADER PERSONALIZADO */}
      <header className="home-header">
        <div>
          <h1 className="greeting">{greeting}, <span className="user-name">{MOCK_USER.name}</span></h1>
          <p className="subtitle">Vamos fazer hoje render!</p>
        </div>
        <div className="header-date">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </header>

      {/* 2. CARDS DE RESUMO (OS 3 PILARES) */}
      <div className="summary-grid">
        
        {/* Card Treino */}
        <Link to="/treino" className="summary-card workout-card">
          <div className="card-icon-bg blue"><LuDumbbell size={24} /></div>
          <div className="card-content">
            <span className="card-label">Próximo Treino</span>
            <h3 className="card-value">{SUMMARY_DATA.nextWorkout}</h3>
          </div>
          <div className="card-arrow"><LuArrowRight /></div>
        </Link>

        {/* Card Dieta */}
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

        {/* Card Financeiro */}
        <Link to="/financeiro" className="summary-card finance-card">
          <div className="card-icon-bg green"><LuWallet size={24} /></div>
          <div className="card-content">
            <span className="card-label">Saldo Livre</span>
            <h3 className="card-value">R$ {SUMMARY_DATA.balance.toFixed(2)}</h3>
          </div>
          <div className="card-arrow"><LuArrowRight /></div>
        </Link>
      </div>

      {/* 3. ÁREA PRINCIPAL (CONSISTÊNCIA E TAREFAS) */}
      <div className="home-main-layout">
        
        {/* ESQUERDA: Consistência / Hábitos */}
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

          {/* Aqui poderia entrar um card de "Próximo estudo" no futuro */}
        </div>

        {/* DIREITA: Tarefas do Dia */}
        <div className="right-section">
          <div className="widget tasks-home-widget">
            <div className="widget-header">
              <h3>Tarefas de Hoje</h3>
              <span className="tasks-count">{tasksDone}/{tasksTotal}</span>
            </div>
            
            {/* Barra de Progresso das Tarefas */}
            <div className="tasks-progress-bar">
              <div className="tasks-fill" style={{ width: `${tasksPercentage}%` }}></div>
            </div>

            <ul className="home-tasks-list">
              {tasks.map(task => (
                <li key={task.id} className={`home-task-item ${task.done ? 'done' : ''}`} onClick={() => toggleTask(task.id)}>
                  {task.done ? <LuCheck className="check-icon done" /> : <LuCircle className="check-icon" />}
                  <span className="task-text">{task.description}</span>
                </li>
              ))}
              {tasks.length === 0 && <p className="empty-tasks">Tudo feito por hoje!</p>}
            </ul>

            <button className="btn-add-task-home" onClick={() => setIsModalOpen(true)}>
              <LuPlus /> Nova Tarefa
            </button>
          </div>
        </div>

      </div>

      {/* Modal de Adicionar Tarefa */}
      <AddTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask} // Ajuste aqui se seu modal pedir objeto, senão use wrapper
        taskToEdit={null} // Se o modal pedir isso
      />
    </div>
  );
}