import { useState } from 'react';
import './treino.css';
import ExerciseCard from '../components/ExerciseCard';
import AddExerciseModal, { type ExerciseData } from '../components/AddExerciseModal';
import CreateTemplateModal from '../components/CreateTemplateModal'; 
import { 
  LuPlus, LuSave, LuPlay, LuCalendar, LuChevronRight, LuArrowLeft, LuTrash2,
  LuClock, LuCheck, LuDumbbell, LuChevronDown, LuPencil, LuX
} from 'react-icons/lu';

// --- TIPOS ---
interface Template {
  id: string;
  name: string;
  description: string;
  exercises: ExerciseData[];
}

interface CompletedWorkout {
  id: string;
  name: string;
  date: string;
  duration: string;
  totalVolume: string;
  exercises: ExerciseData[]; 
  sessionData: Record<string, { weight: string[], reps: string[] }>;
}

interface WeekHistory {
  id: number;
  label: string;
  status: string;
  workouts: CompletedWorkout[];
}

// --- DADOS INICIAIS ---
const INITIAL_TEMPLATES: Template[] = [
  { 
    id: 'upper-a', 
    name: 'Upper A', 
    description: 'Foco em Peito e Costas',
    exercises: [
      { id: '1', name: 'Supino Inclinado', sets: 4, reps: '8-12', rest: '90s', imageUrl: 'https://placehold.co/400x400/27272a/1DB954/png?text=Supino' },
      { id: '2', name: 'Puxada Alta', sets: 3, reps: '10-12', rest: '60s', imageUrl: 'https://placehold.co/400x400/27272a/1DB954/png?text=Puxada' },
    ]
  },
  { 
    id: 'lower-a', 
    name: 'Lower A', 
    description: 'Foco em Quadríceps',
    exercises: [
      { id: '3', name: 'Agachamento Livre', sets: 4, reps: '6-8', rest: '120s', imageUrl: 'https://placehold.co/400x400/27272a/1DB954/png?text=Agachamento' },
    ]
  }
];

const INITIAL_WEEKS: WeekHistory[] = [
  { id: 1, label: 'Semana Atual', status: 'Em andamento', workouts: [] },
  { 
    id: 2, label: 'Semana Passada', status: 'Concluída', workouts: [
      {
        id: 'h1', name: 'Upper A', date: 'Segunda, 12/10', duration: '55min', totalVolume: '4.200kg',
        exercises: [
          { id: 'ex1', name: 'Supino Inclinado', sets: 3, reps: '8-12', rest: '90s' },
          { id: 'ex2', name: 'Puxada Alta', sets: 2, reps: '10-12', rest: '60s' }
        ],
        sessionData: {
          'ex1': { weight: ['20', '22', '24'], reps: ['12', '10', '8'] },
          'ex2': { weight: ['40', '45'], reps: ['12', '10'] }
        }
      }
    ] 
  },
];

export default function TreinoPage() {
  // --- ESTADOS GERAIS ---
  const [viewMode, setViewMode] = useState<'HOME' | 'SESSION' | 'WEEK_DETAILS'>('HOME');
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [weeks, setWeeks] = useState<WeekHistory[]>(INITIAL_WEEKS);
  const [selectedWeekId, setSelectedWeekId] = useState<number | null>(null);

  // --- ESTADOS DA SESSÃO ---
  const [activeTemplateName, setActiveTemplateName] = useState('');
  const [currentExercises, setCurrentExercises] = useState<ExerciseData[]>([]);
  const [sessionData, setSessionData] = useState<Record<string, { weight: string[], reps: string[] }>>({});
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);

  // Modais
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSelectTemplateModalOpen, setIsSelectTemplateModalOpen] = useState(false); // NOVO MODAL DE SELEÇÃO
  const [editingExercise, setEditingExercise] = useState<ExerciseData | null>(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const selectedWeek = weeks.find(w => w.id === selectedWeekId);

  // --- FUNÇÕES DE NAVEGAÇÃO ---
  
  const startSession = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEditingHistoryId(null);
      setCurrentExercises(template.exercises);
      setActiveTemplateName(template.name);
      setSessionData({});
      setIsSelectTemplateModalOpen(false); // Fecha o seletor se estiver aberto
      setViewMode('SESSION');
    }
  };

  const handleEditHistorySession = (workout: CompletedWorkout) => {
    setEditingHistoryId(workout.id);
    setActiveTemplateName(workout.name + " (Editando)");
    setCurrentExercises(workout.exercises);
    setSessionData(workout.sessionData);
    setViewMode('SESSION');
  };

  const openWeekDetails = (weekId: number) => {
    setSelectedWeekId(weekId);
    setViewMode('WEEK_DETAILS');
  };

  const goBackHome = () => {
    if (viewMode === 'SESSION') {
      if (confirm("Sair sem salvar?")) {
        if (editingHistoryId && selectedWeekId) setViewMode('WEEK_DETAILS');
        else if (selectedWeekId && selectedWeekId !== 1) setViewMode('WEEK_DETAILS');
        else setViewMode('HOME');
      }
    } else {
      setViewMode('HOME');
    }
  };

  // --- FUNÇÕES DA SESSÃO (CRUD) ---
  
  const handleFinishSession = () => {
    let vol = 0;
    Object.values(sessionData).forEach(d => d.weight.forEach(w => vol += Number(w || 0)));
    const totalVolStr = vol > 0 ? `${vol}kg` : '-';

    if (editingHistoryId) {
      // EDITANDO EXISTENTE
      setWeeks(prevWeeks => prevWeeks.map(week => {
        if (week.id === selectedWeekId) {
          return {
            ...week,
            workouts: week.workouts.map(wo => wo.id === editingHistoryId ? {
              ...wo, totalVolume: totalVolStr, exercises: currentExercises, sessionData: sessionData
            } : wo)
          };
        }
        return week;
      }));
      alert("Treino atualizado!");
      setViewMode('WEEK_DETAILS');

    } else {
      // CRIANDO NOVO (Salva na semana selecionada ou na atual)
      const targetWeekId = selectedWeekId || 1; // Se não tiver semana selecionada, usa a 1 (Atual)
      
      const newWorkout: CompletedWorkout = {
        id: crypto.randomUUID(),
        name: activeTemplateName,
        date: 'Adicionado Agora',
        duration: '45min',
        totalVolume: totalVolStr,
        exercises: currentExercises,
        sessionData: sessionData
      };

      setWeeks(prevWeeks => prevWeeks.map(week => {
        if (week.id === targetWeekId) {
          return { ...week, workouts: [newWorkout, ...week.workouts] };
        }
        return week;
      }));
      
      alert("Treino salvo!");
      // Se salvou na semana atual, volta pra home, senão volta pros detalhes daquela semana
      if (targetWeekId === 1) setViewMode('HOME');
      else setViewMode('WEEK_DETAILS');
    }
  };

  // --- Helpers ---
  const toggleHistoryItem = (id: string) => setExpandedHistoryId(expandedHistoryId === id ? null : id);
  
  // (Resto das funções iguais: handleCreateTemplate, handleAddNew...)
  const handleCreateTemplate = (name: string, desc: string, exs: ExerciseData[]) => {
    const newTemplate: Template = { id: crypto.randomUUID(), name, description: desc, exercises: exs };
    setTemplates([...templates, newTemplate]);
  };
  const handleDeleteTemplate = (id: string) => {
    if (confirm("Excluir modelo?")) setTemplates(prev => prev.filter(t => t.id !== id));
  };
  const handleAddNew = () => { setEditingExercise(null); setIsExerciseModalOpen(true); };
  const handleEdit = (exercise: ExerciseData) => { setEditingExercise(exercise); setIsExerciseModalOpen(true); };
  const handleSaveExercise = (data: ExerciseData) => {
    if (editingExercise) setCurrentExercises(prev => prev.map(ex => ex.id === data.id ? data : ex));
    else setCurrentExercises(prev => [...prev, data]);
  };
  const handleRemove = (id: string) => { if (confirm('Remover?')) setCurrentExercises(prev => prev.filter(ex => ex.id !== id)); };
  const handleInputChange = (exerciseId: string, type: 'weight' | 'reps', index: number, value: string) => {
    setSessionData(prev => {
      const exSession = prev[exerciseId] || { weight: [], reps: [] };
      const newValues = { ...exSession };
      if (!newValues[type]) newValues[type] = [];
      newValues[type][index] = value;
      return { ...prev, [exerciseId]: newValues };
    });
  };
  const handleAddSet = (exerciseId: string) => {
    setCurrentExercises(prev => prev.map(ex => ex.id === exerciseId ? { ...ex, sets: ex.sets + 1 } : ex));
  };
  const handleRemoveSet = (exerciseId: string, setIndexToRemove: number) => {
    setCurrentExercises(prev => prev.map(ex => ex.id === exerciseId ? { ...ex, sets: Math.max(1, ex.sets - 1) } : ex));
  };

  // --- RENDERIZAÇÃO ---

  // 1. TELA HOME
  if (viewMode === 'HOME') {
    return (
      <div className="page-container">
        <header className="page-header">
          <h1>Central de Treinos</h1>
          <p>Gerencie sua rotina e acompanhe seu progresso.</p>
        </header>

        <div className="treino-dashboard-grid">
          <div className="start-workout-card">
            <div className="start-header">
              <div className="icon-bg"><LuPlay size={32} /></div>
              <div><h2>Iniciar Treino</h2><p>Selecione o treino de hoje:</p></div>
            </div>
            <div className="template-selector-list">
              {templates.map(t => (
                <button key={t.id} className="template-select-btn" onClick={() => { setSelectedWeekId(1); startSession(t.id); }}>
                  <span className="template-btn-name">{t.name}</span>
                  <span className="template-btn-desc">{t.description}</span>
                  <LuChevronRight className="arrow-icon" />
                </button>
              ))}
            </div>
          </div>

          <div className="templates-card">
            <div className="card-header-simple">
              <h3>Modelos Salvos</h3>
              <button className="btn-text" onClick={() => setIsTemplateModalOpen(true)}>+ Criar</button>
            </div>
            <ul className="models-list">
              {templates.map(t => (
                <li key={t.id}>
                  <div className="model-info"><span className="dot"></span> {t.name}</div>
                  <button className="btn-delete-model" onClick={() => handleDeleteTemplate(t.id)}><LuTrash2 size={16} /></button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="weeks-section">
          <h3>Histórico Semanal</h3>
          <div className="weeks-grid">
            {weeks.map(week => (
              <div key={week.id} className="week-card" onClick={() => openWeekDetails(week.id)}>
                <div className="week-header">
                  <LuCalendar size={20} />
                  <span>{week.label}</span>
                </div>
                <div className="week-body">
                  <span className={`status-badge ${week.status === 'Em andamento' ? 'active' : ''}`}>{week.status}</span>
                  <div className="week-workouts">
                    {week.workouts.length > 0 ? week.workouts.map((w, i) => <span key={i} className="mini-tag">{w.name}</span>) : <span className="mini-tag empty">Sem registros</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CreateTemplateModal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} onSave={handleCreateTemplate} />
      </div>
    );
  }

  // 2. TELA DE DETALHES DA SEMANA
  if (viewMode === 'WEEK_DETAILS' && selectedWeek) {
    return (
      <div className="page-container">
        <header className="page-header session-header">
          <button className="btn-back" onClick={goBackHome}><LuArrowLeft size={24} /></button>
          <div>
            <h1>{selectedWeek.label}</h1>
            <p>Resumo das atividades realizadas.</p>
          </div>
          
          {/* 1. O NOVO BOTÃO DE ADICIONAR */}
          <div className="header-actions">
            <button className="btn-primary small" onClick={() => setIsSelectTemplateModalOpen(true)}>
              <LuPlus size={18} /> Adicionar
            </button>
          </div>
        </header>

        <div className="week-details-content">
          {selectedWeek.workouts.length === 0 ? (
            <div className="empty-state-box">
              <LuCalendar size={48} />
              <p>Nenhum treino registrado nesta semana.</p>
            </div>
          ) : (
            <div className="history-list">
              {selectedWeek.workouts.map(workout => {
                const isOpen = expandedHistoryId === workout.id;
                return (
                  <div key={workout.id} className={`history-card ${isOpen ? 'open' : ''}`}>
                    <div className="history-header" onClick={() => toggleHistoryItem(workout.id)}>
                      <div className="history-main-info">
                        <h3>{workout.name}</h3>
                        <span className="history-date">{workout.date}</span>
                      </div>
                      <div className="history-stats">
                        <span><LuClock size={14}/> {workout.duration}</span>
                        <button className="btn-edit-history" onClick={(e) => { e.stopPropagation(); handleEditHistorySession(workout); }} title="Editar"><LuPencil size={16} /></button>
                        {isOpen ? <LuChevronDown /> : <LuChevronRight />}
                      </div>
                    </div>
                    {isOpen && (
                      <div className="history-body">
                        {workout.exercises.map((ex, i) => (
                          <div key={i} className="history-exercise-row">
                            <div className="hist-ex-name">{ex.name}</div>
                            <div className="hist-ex-sets">
                              {(workout.sessionData[ex.id]?.weight || Array(ex.sets).fill('-')).map((w, j) => (
                                <div key={j} className="hist-set-tag">
                                  <span className="hist-kg">{w}kg</span><span className="hist-x">x</span><span className="hist-reps">{workout.sessionData[ex.id]?.reps[j] || '-'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. O NOVO MODAL DE SELEÇÃO RÁPIDA (Inline) */}
        {isSelectTemplateModalOpen && (
          <div className="modal-overlay" onClick={() => setIsSelectTemplateModalOpen(false)}>
            <div className="modal-content template-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
              <header className="modal-header">
                <h2>Escolha o Treino</h2>
                <button className="close-button" onClick={() => setIsSelectTemplateModalOpen(false)}><LuX size={24} /></button>
              </header>
              <div className="modal-body" style={{ padding: '1rem' }}>
                <div className="template-selector-list">
                  {templates.map(t => (
                    <button key={t.id} className="template-select-btn" onClick={() => startSession(t.id)}>
                      <span className="template-btn-name">{t.name}</span>
                      <LuChevronRight className="arrow-icon" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. TELA DE SESSÃO ATIVA
  return (
    <div className="page-container">
      <header className="page-header session-header">
        <button className="btn-back" onClick={goBackHome}><LuArrowLeft size={24} /></button>
        <div><h1>{editingHistoryId ? 'Editando' : 'Treinando'}: {activeTemplateName}</h1><p>Foco Total • Registre suas cargas</p></div>
        <div className="header-actions">
          <button className="btn-primary small" onClick={handleFinishSession}><LuSave size={18} /> Salvar</button>
        </div>
      </header>

      <div className="treino-content">
        <div className="exercise-list">
          {currentExercises.map(exercise => (
            <ExerciseCard 
              key={exercise.id} exercise={exercise}
              onEdit={() => handleEdit(exercise)} onRemove={() => handleRemove(exercise.id)}
              sessionValues={sessionData[exercise.id] || { weight: [], reps: [] }}
              onInputChange={(type, index, value) => handleInputChange(exercise.id, type, index, value)}
              onAddSet={() => handleAddSet(exercise.id)} onRemoveSet={(index) => handleRemoveSet(exercise.id, index)}
            />
          ))}
        </div>
        <button className="btn-add-exercise" onClick={handleAddNew}><LuPlus size={24} /><span>Adicionar Exercício Extra</span></button>
      </div>

      <AddExerciseModal isOpen={isExerciseModalOpen} onClose={() => setIsExerciseModalOpen(false)} onSubmit={handleSaveExercise} initialData={editingExercise} />
    </div>
  );
}