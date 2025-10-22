import { useState } from 'react';

// 1. A gente só precisa importar o CSS diretamente. Simples assim.
import './home.css';

// 2. Importamos nosso componente do modal, como antes.
import AddTaskModal from '../components/AddTaskModal';

export default function HomePage() {
  // O resto do código continua exatamente o mesmo
  const [stats, setStats] = useState({
    diasCertos: 15,
    diasDeTreino: 12,
    diasDeEstudo: 20
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Meu Progresso</h1>
        <p>Outubro 2025</p>
      </header>

      <main>
        <div className="stats-card">
          <div className="stats-value">{stats.diasCertos} / 31</div>
          <div className="stats-label">Dias em conformidade no mês</div>
        </div>

        <div className="reports-section">
          <button className="btn-report">Relatório Semanal</button>
          <button className="btn-report">Relatório Mensal</button>
        </div>
      </main>

      <button className="fab" onClick={() => setIsModalOpen(true)}>+</button>

      <AddTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={(task) => console.log('Nova tarefa:', task)}
      />
    </div>
  );
}