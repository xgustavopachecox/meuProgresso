import React from 'react';
import './ViewTemplateModal.css'; // Vamos criar este CSS

// 1. Definimos os "tipos" de dados que o modal vai receber
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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null; // O modal pode estar vazio
}

const ViewTemplateModal: React.FC<ModalProps> = ({ isOpen, onClose, template }) => {
  if (!isOpen || !template) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <header className="modal-header">
          <h2>{template.name} <span className="modal-header-tag">{template.tag}</span></h2>
          <button className="close-button" onClick={onClose}>×</button>
        </header>

        <div className="modal-body">
          <h3 className="exercise-list-title">Exercícios</h3>
          <ul className="exercise-list">
            {template.exercises.map((exercise, index) => (
              <li key={index} className="exercise-item">
                <span className="exercise-name">{exercise.name}</span>
                <span className="exercise-details">{exercise.sets} sets x {exercise.reps} reps</span>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </div>
  );
}

export default ViewTemplateModal;