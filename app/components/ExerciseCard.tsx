import React from 'react';
import { LuPencil, LuTrash2, LuInfo, LuCheck, LuPlus, LuX } from 'react-icons/lu';
import './ExerciseCard.css';
import { type ExerciseData } from './AddExerciseModal';

interface ExerciseCardProps {
  exercise: ExerciseData;
  onEdit: () => void;
  onRemove: () => void;
  sessionValues: { weight: string[]; reps: string[] }; 
  onInputChange: (type: 'weight' | 'reps', setIndex: number, value: string) => void;
  // NOVAS PROPS
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
}

export default function ExerciseCard({ 
  exercise, 
  onEdit, 
  onRemove, 
  sessionValues, 
  onInputChange,
  onAddSet,
  onRemoveSet
}: ExerciseCardProps) {
  
  return (
    <div className="exercise-card">
      
      {/* HEADER (igual) */}
      <div className="ex-card-header">
        <div className="ex-header-left">
          {exercise.imageUrl && (
            <div className="ex-image-thumb">
              <img src={exercise.imageUrl} alt={exercise.name} />
            </div>
          )}
          <div className="ex-info">
            <h3 className="ex-name">{exercise.name}</h3>
            <span className="ex-meta">
              {/* Agora mostramos o número dinâmico de séries */}
              {exercise.sets} Séries • {exercise.reps} Reps • {exercise.rest}
            </span>
          </div>
        </div>
        
        <div className="ex-actions">
          <button className="ex-action-btn edit" onClick={onEdit} title="Editar Detalhes">
            <LuPencil size={18} />
          </button>
          <button className="ex-action-btn delete" onClick={onRemove} title="Remover Exercício Inteiro">
            <LuTrash2 size={18} />
          </button>
        </div>
      </div>

      {exercise.notes && (
        <div className="ex-notes">
          <LuInfo size={14} />
          <p>{exercise.notes}</p>
        </div>
      )}

      <div className="ex-inputs-area">
        <div className="ex-inputs-header">
          <span>SET</span>
          <span>KG</span>
          <span>REPS</span>
          <span>OK</span>
        </div>

        {/* Renderiza baseado no número de séries atual */}
        {Array.from({ length: exercise.sets }).map((_, index) => (
          <div key={index} className="ex-input-row group">
            <div className="set-number">{index + 1}</div>
            
            <input 
              type="number" 
              placeholder="-" 
              className="ex-input"
              value={sessionValues.weight[index] || ''}
              onChange={(e) => onInputChange('weight', index, e.target.value)}
            />
            
            <input 
              type="number" 
              placeholder={exercise.reps} 
              className="ex-input"
              value={sessionValues.reps[index] || ''}
              onChange={(e) => onInputChange('reps', index, e.target.value)}
            />

            <div className={`set-check ${sessionValues.reps[index] ? 'done' : ''}`}>
              <LuCheck size={20} />
            </div>

            {/* Botão de Deletar Série (X) */}
            <button 
              className="btn-delete-set" 
              onClick={() => onRemoveSet(index)}
              title="Remover esta série"
            >
              <LuX size={16} />
            </button>
          </div>
        ))}

        {/* Botão de Adicionar Série (+) */}
        <button className="btn-add-set-row" onClick={onAddSet}>
          <LuPlus size={16} /> Adicionar Série
        </button>
      </div>
    </div>
  );
}