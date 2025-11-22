import './progresso.css';
import { 
  LuCalendar, LuDumbbell, LuUtensils, LuWallet, 
  LuTrendingUp, LuCheck, LuX
} from 'react-icons/lu';

// --- DADOS SIMULADOS (MOCK) ---
const PROGRESSO_SEMANAL = [
  {
    id: 1,
    label: "Semana Atual",
    dateRange: "18 Nov - 24 Nov",
    status: "Em andamento",
    stats: {
      treino: { feito: 2, total: 5, status: "neutral" }, // neutral, success, fail
      dieta: { mediaKcal: 3100, diasNaMeta: "2/3", status: "success" },
      financeiro: { guardado: 150.00, gastos: 400.00, status: "success" }
    }
  },
  {
    id: 2,
    label: "Semana Passada",
    dateRange: "11 Nov - 17 Nov",
    status: "Concluída",
    stats: {
      treino: { feito: 5, total: 5, status: "success" },
      dieta: { mediaKcal: 3250, diasNaMeta: "6/7", status: "success" },
      financeiro: { guardado: 800.00, gastos: 250.00, status: "success" }
    }
  },
  {
    id: 3,
    label: "Semana Retrasada",
    dateRange: "04 Nov - 10 Nov",
    status: "Concluída",
    stats: {
      treino: { feito: 3, total: 5, status: "fail" },
      dieta: { mediaKcal: 2800, diasNaMeta: "3/7", status: "fail" },
      financeiro: { guardado: 0.00, gastos: 600.00, status: "neutral" }
    }
  }
];

export default function ProgressoPage() {
  
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Helper para ícone de status
  const getStatusIcon = (status: string) => {
    if (status === 'success') return <LuCheck className="icon-success" />;
    if (status === 'fail') return <LuX className="icon-fail" />;
    
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Meu Progresso</h1>
        <p>Visão holística da sua evolução semanal.</p>
      </header>

      <div className="timeline-list">
        {PROGRESSO_SEMANAL.map(semana => (
          <div key={semana.id} className="week-summary-card">
            
            {/* Cabeçalho da Semana */}
            <div className="week-summary-header">
              <div className="week-title-group">
                <LuCalendar size={20} className="calendar-icon"/>
                <div>
                  <h3>{semana.label}</h3>
                  <span className="week-date">{semana.dateRange}</span>
                </div>
              </div>
              <span className={`week-badge ${semana.status === 'Em andamento' ? 'active' : ''}`}>
                {semana.status}
              </span>
            </div>

            {/* Grid dos 3 Pilares */}
            <div className="pillars-grid">
              
              {/* TREINO */}
              <div className={`pillar-box workout-box ${semana.stats.treino.status}`}>
                <div className="pillar-header">
                  <LuDumbbell size={18} />
                  <span>Treino</span>
                </div>
                <div className="pillar-content">
                  <span className="pillar-big-value">
                    {semana.stats.treino.feito}/{semana.stats.treino.total}
                  </span>
                  <span className="pillar-sub">Sessões</span>
                </div>
                <div className="pillar-status-icon">
                  {getStatusIcon(semana.stats.treino.status)}
                </div>
              </div>

              {/* DIETA */}
              <div className={`pillar-box diet-box ${semana.stats.dieta.status}`}>
                <div className="pillar-header">
                  <LuUtensils size={18} />
                  <span>Dieta</span>
                </div>
                <div className="pillar-content">
                  <span className="pillar-big-value">
                    {semana.stats.dieta.diasNaMeta}
                  </span>
                  <span className="pillar-sub">Dias na Meta</span>
                  <span className="pillar-detail">Média: {semana.stats.dieta.mediaKcal}kcal</span>
                </div>
                <div className="pillar-status-icon">
                  {getStatusIcon(semana.stats.dieta.status)}
                </div>
              </div>

              {/* FINANCEIRO */}
              <div className={`pillar-box finance-box ${semana.stats.financeiro.status}`}>
                <div className="pillar-header">
                  <LuWallet size={18} />
                  <span>Financeiro</span>
                </div>
                <div className="pillar-content">
                  <div className="finance-row">
                    <LuTrendingUp size={14} className="up-icon"/> 
                    <span className="saved-text">Guardou: {formatMoney(semana.stats.financeiro.guardado)}</span>
                  </div>
                  <span className="spent-text">Gastou: {formatMoney(semana.stats.financeiro.gastos)}</span>
                </div>
                <div className="pillar-status-icon">
                  {getStatusIcon(semana.stats.financeiro.status)}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}