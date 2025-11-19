import { useState } from 'react';
import './treino.css';
import { LuChevronRight } from 'react-icons/lu';
import ViewTemplateModal from '../components/ViewTemplateModal';
import RegisterSessionModal from '../components/RegisterSessionModal';

// --- DEFINIÇÃO DOS DADOS SIMULADOS (SEU TREINO REAL) ---
interface Exercise { name: string; sets: number; reps: string; }
interface Template { id: string; name: string; tag: string; exercises: Exercise[]; }

const MOCK_TEMPLATES_DATA: Template[] = [
  { 
    id: 'a', 
    name: 'Upper A', 
    tag: '(A)', 
    exercises: [
      { name: 'Supino Inclinado (halter)', sets: 2, reps: '8-12' },
      { name: 'Voador', sets: 3, reps: '8-12' },
      { name: 'Puxada Alta', sets: 3, reps: '8-12' },
      { name: 'Remada Máquina', sets: 3, reps: '8-12' },
      { name: 'Desenvolvimento c/ Halteres', sets: 3, reps: '8-12' },
      { name: 'Tríceps pulley', sets: 3, reps: '8-12' },
      { name: 'Rosca direta', sets: 3, reps: '8-12' },
    ] 
  },
  { 
    id: 'b', 
    name: 'Lower A', 
    tag: '(B)',
    exercises: [
      { name: 'Hack', sets: 4, reps: '8-12' },
      { name: 'Extensora', sets: 3, reps: '10-15' },
      { name: 'Cadeira flexora', sets: 3, reps: '12-15' },
      { name: 'mesa flexora', sets: 4, reps: '15-20' },
      { name: 'adutora', sets: 4, reps: '15-20' },
    ]
  },
  { 
    id: 'c', 
    name: 'Upper B', 
    tag: '(C)',
    exercises: [
      { name: 'Remada Maquina', sets: 4, reps: '8-12' },
      { name: 'Supino reto', sets: 3, reps: '8-12' },
      { name: 'puxada alta', sets: 4, reps: '8-12' },
      { name: 'Elevação Lateral', sets: 4, reps: '8-12' },
      { name: 'triceps francês', sets: 4, reps: '8-12' },
      { name: 'Rosca scott', sets: 3, reps: '8-12' },
    ]
  },
  { 
    id: 'd', 
    name: 'Lower B', 
    tag: '(D)',
    exercises: [
      { name: 'leg pres', sets: 3, reps: '5-8' },
      { name: 'stiff', sets: 3, reps: '10-15' },
      { name: 'mesa flexora', sets: 3, reps: '10-12' },
      { name: 'cadeira extensora', sets: 4, reps: '15-20' },
      { name: 'adutora', sets: 4, reps: '15-20' },
    ]
  },
];
// ------------------------------------

export default function TreinoPage() {
  
  // --- Estados dos Modais ---
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // --- Funções de Controle ---
  const handleViewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  const handleRegisterSubmit = (sessionData: any) => {
    console.log("SESSÃO REGISTRADA:", sessionData);
    // No futuro, aqui é onde faremos a chamada de API (POST) para o backend
    setIsRegisterModalOpen(false); // Fecha o modal
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Meu Treino</h1>
        <p>Gerencie seus modelos de treino e registre suas sessões diárias.</p>
      </header>

      <div className="treino-layout">
        <div className="treino-main-column">
          <div className="widget">
            <h3 className="widget-title">Registrar Treino de Hoje</h3>
            <button 
              className="btn-primary" 
              onClick={() => setIsRegisterModalOpen(true)}
            >
              Registrar Sessão
            </button>
            <p className="widget-subtitle">(Ao clicar, abrirá um modal para selecionar o treino do dia e preencher os pesos/reps).</p>
          </div>

          <div className="widget">
            <h3 className="widget-title">Histórico Recente</h3>
            <div className="placeholder-box">
              <p>(Em breve: Um calendário ou lista com os últimos treinos registrados).</p>
            </div>
          </div>
        </div>

        <div className="treino-side-column">
          <div className="widget">
            <h3 className="widget-title">Meus Modelos de Treino</h3>
            
            <ul className="template-list">
              {MOCK_TEMPLATES_DATA.map(template => (
                <li 
                  key={template.id} 
                  className="template-item" 
                  onClick={() => handleViewTemplate(template)}
                >
                  <div className="template-item-info">
                    <span className="template-name">{template.name}</span>
                    <span className="template-tag">{template.tag}</span>
                  </div>
                  <LuChevronRight size={20} className="template-item-icon" />
                </li>
              ))}
            </ul>

            <button className="btn-secondary">+ Novo Modelo</button>
          </div>
        </div>
      </div>

      {/* --- Renderização dos Modais --- */}
      <ViewTemplateModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        template={selectedTemplate}
      />
      
      <RegisterSessionModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        templates={MOCK_TEMPLATES_DATA}
        onSubmit={handleRegisterSubmit}
      />
    </div>
  );
}