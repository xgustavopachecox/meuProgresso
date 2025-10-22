import React, { useState } from 'react';
import './AddTaskModal.css';

// Definindo os tipos das propriedades que o componente recebe
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: { description: string; dueDate: string }) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
      alert('Por favor, adicione uma descrição para a tarefa.');
      return;
    }
    console.log({ description, dueDate });
    onAddTask({ description, dueDate });
    setDescription('');
    setDueDate('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Adicionar Nova Tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Data</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-add">Adicionar</button>
        </form>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default AddTaskModal;