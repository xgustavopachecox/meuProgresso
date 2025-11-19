import React, { useState } from 'react';
import './RegisterSessionModal.css';
import { LuHistory } from 'react-icons/lu'; // 1. IMPORTAR O NOVO ÍCONE

// --- Definindo os Tipos ---
interface Exercise {
  name: string;
  sets: number;
  reps: string;
}
interface Template {
  id: string;
  name: string;
  tag: string;
  exercises: Exercise[];
}
interface SessionEntry {
  reps: string;
  weight: string;
}

// --- Props que o Modal recebe ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onSubmit: (sessionData: any) => void;
}

const RegisterSessionModal: React.FC<ModalProps> = ({ isOpen, onClose, templates, onSubmit }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [sessionEntries, setSessionEntries] = useState(new Map<string, SessionEntry[]>());

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    
    const newEntries = new Map<string, SessionEntry[]>();
    if (template) {
      template.exercises.forEach(ex => {
        const setsArray = Array.from({ length: ex.sets }, () => ({ reps: '', weight: '' }));
        newEntries.set(ex.name, setsArray);
      });
    }
    setSessionEntries(newEntries);
  };

  const handleInputChange = (exerciseName: string, setIndex: number, field: 'reps' | 'weight', value: string) => {
    const newEntries = new Map(sessionEntries);
    const sets = newEntries.get(exerciseName);
    
    if (sets) {
      sets[setIndex][field] = value;
      setSessionEntries(newEntries);
    }
  };

  const handleCopySet = (exerciseName: string, setIndex: number) => {
    if (setIndex === 0) return; 

    const newEntries = new Map(sessionEntries);
    const sets = newEntries.get(exerciseName);

    if (sets) {
      const prevSet = sets[setIndex - 1]; 
      const currSet = sets[setIndex];     

      currSet.weight = prevSet.weight;
      currSet.reps = prevSet.reps;

      setSessionEntries(newEntries); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sessionData = {
      templateId: selectedTemplateId,
      date: new Date().toISOString(),
      entries: Object.fromEntries(sessionEntries), 
    };
    onSubmit(sessionData);
    setSelectedTemplateId('');
    setSessionEntries(new Map());
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <header className="modal-header">
            <h2>Registrar Nova Sessão</h2>
            <button type="button" className="close-button" onClick={onClose}>×</button>
          </header>

          <div className="modal-body">
            {/* --- Etapa 1: Selecionar o Treino --- */}
            <div className="form-group">
              <label htmlFor="template-select">Qual treino você fez hoje?</label>
              <select 
                id="template-select"
                value={selectedTemplateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
              >
                <option value="" disabled>-- Selecione um modelo --</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} {template.tag}
                  </option>
                ))}
              </select>
            </div>

            {/* --- Etapa 2: Preencher os Exercícios --- */}
            {selectedTemplate && (
              <div className="exercise-log-list">
                <h3 className="exercise-list-title">Preencha seu progresso</h3>
                
                {/* 2. ADICIONAR O BOTÃO AQUI */}
                <button 
                  type="button" 
                  className="btn-copy-last"
                  onClick={() => console.log('Lógica de copiar último treino...')}
                >
                  <LuHistory size={16} />
                  Copiar Último Treino
                </button>
                {/* --------------------------- */}

                {selectedTemplate.exercises.map((ex, exIndex) => (
                  <div key={ex.name} className="exercise-log-item">
                    <h4 className="exercise-log-name">{ex.name} <span className="exercise-log-goal">({ex.sets}x{ex.reps})</span></h4>
                    <div className="exercise-log-inputs">
                      
                      <div className="input-header">
                        <span>Série</span>
                        <span>Peso (kg)</span>
                        <span>Reps</span>
                        <span>Ação</span> 
                      </div>
                      
                      {sessionEntries.get(ex.name)?.map((set, setIndex) => (
                        <div key={setIndex} className="input-row">
                          <label>Série {setIndex + 1}</label>
                          <input 
                            type="number" 
                            placeholder="kg"
                            className="input-weight"
                            value={set.weight}
                            onChange={(e) => handleInputChange(ex.name, setIndex, 'weight', e.target.value)}
                          />
                          <input 
                            type="number" 
                            placeholder="reps"
                            className="input-reps"
                            value={set.reps}
                            onChange={(e) => handleInputChange(ex.name, setIndex, 'reps', e.target.value)}
                          />
                          
                          <div className="copy-set-container">
                            {setIndex > 0 && ( 
                              <button 
                                type="button" 
                                className="btn-copy-set"
                                onClick={() => handleCopySet(ex.name, setIndex)}
                              >
                                Copiar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <footer className="modal-footer">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={!selectedTemplate}
            >
              Salvar Sessão
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default RegisterSessionModal;