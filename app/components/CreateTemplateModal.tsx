import React, { useState } from 'react';
import './CreateTemplateModal.css'; // Vamos criar em seguida
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { LuPlus, LuTrash2, LuSave, LuSearch } from 'react-icons/lu';

// Tipos
interface ExerciseData {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  imageUrl?: string;
}

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateName: string, description: string, exercises: ExerciseData[]) => void;
}

export default function CreateTemplateModal({ isOpen, onClose, onSave }: CreateTemplateModalProps) {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<ExerciseData[]>([]);
  const [selectedLibId, setSelectedLibId] = useState('');

  if (!isOpen) return null;

  // Adiciona exercício da biblioteca para o template
  const handleAddExercise = () => {
    if (!selectedLibId) return;

    const libExercise = EXERCISE_LIBRARY.find(ex => ex.id === selectedLibId);
    if (libExercise) {
      const newExercise: ExerciseData = {
        id: crypto.randomUUID(), // ID único para esta instância
        name: libExercise.name,
        sets: libExercise.defaultSets,
        reps: libExercise.defaultReps,
        rest: libExercise.defaultRest,
        imageUrl: libExercise.imageUrl
      };

      setSelectedExercises([...selectedExercises, newExercise]);
      setSelectedLibId(''); // Reseta o select
    }
  };

  // Remove exercício da lista provisória
  const handleRemoveExercise = (id: string) => {
    setSelectedExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName || selectedExercises.length === 0) {
      alert("Dê um nome ao treino e adicione pelo menos 1 exercício.");
      return;
    }
    onSave(templateName, description, selectedExercises);
    
    // Limpa tudo
    setTemplateName('');
    setDescription('');
    setSelectedExercises([]);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content template-modal" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Criar Novo Treino</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </header>

        <div className="modal-body">
          
          {/* 1. DADOS BÁSICOS */}
          <div className="form-group">
            <label>Nome do Treino</label>
            <input 
              type="text" 
              placeholder="Ex: Upper B" 
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Descrição (Foco)</label>
            <input 
              type="text" 
              placeholder="Ex: Foco em Ombros e Braços" 
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <hr className="divider" />

          {/* 2. SELETOR DE EXERCÍCIOS */}
          <div className="add-exercise-section">
            <label>Adicionar Exercícios</label>
            <div className="select-row">
              <select 
                value={selectedLibId} 
                onChange={e => setSelectedLibId(e.target.value)}
              >
                <option value="" disabled>Selecione da biblioteca...</option>
                {EXERCISE_LIBRARY.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
              <button type="button" className="btn-icon-add" onClick={handleAddExercise}>
                <LuPlus size={20} />
              </button>
            </div>
          </div>

          {/* 3. LISTA DE EXERCÍCIOS SELECIONADOS */}
          <div className="selected-exercises-list">
            {selectedExercises.length === 0 ? (
              <p className="empty-msg">Nenhum exercício adicionado.</p>
            ) : (
              <ul>
                {selectedExercises.map((ex, index) => (
                  <li key={ex.id} className="selected-item">
                    <div className="item-info">
                      <span className="item-number">{index + 1}</span>
                      <div>
                        <span className="item-name">{ex.name}</span>
                        <span className="item-meta">{ex.sets}x{ex.reps}</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn-remove-item"
                      onClick={() => handleRemoveExercise(ex.id)}
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        <footer className="modal-footer">
          <button className="btn-primary" onClick={handleSubmit}>
            <LuSave size={18} /> Salvar Modelo
          </button>
        </footer>
      </div>
    </div>
  );
}