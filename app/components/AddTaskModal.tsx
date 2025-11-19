import React, { useState, useEffect } from 'react';
import './AddTaskModal.css';

// 1. A interface da tarefa (para a prop taskToEdit)
interface Task {
  id: number;
  description: string;
  done: boolean;
}

// 2. A interface de props do modal foi atualizada
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: { description: string; id?: number }) => void; // Renomeado de onAddTask para onSubmit
  taskToEdit: Task | null; // A nova prop! Se for null, estamos adicionando.
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSubmit, taskToEdit }) => {
  const [description, setDescription] = useState('');

  // 3. Este 'useEffect' é a mágica!
  // Ele roda sempre que o modal abre ou a tarefa para editar muda.
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        // Modo Edição: Preenche o campo com a descrição atual
        setDescription(taskToEdit.description);
      } else {
        // Modo Adição: Limpa o campo
        setDescription('');
      }
    }
  }, [isOpen, taskToEdit]); // Dependências: rode quando 'isOpen' ou 'taskToEdit' mudar

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
      alert('Por favor, adicione uma descrição para a tarefa.');
      return;
    }
    
    // 4. Envia os dados de volta. Se for edição, envia o ID junto.
    onSubmit({ 
      description: description, 
      id: taskToEdit ? taskToEdit.id : undefined 
    });
    
    // O 'onClose' agora é chamado pela página 'home.tsx' após o submit.
  };

  // 5. Determina o título e o texto do botão com base no modo
  const isEditing = taskToEdit !== null;
  const modalTitle = isEditing ? 'Editar Tarefa' : 'Adicionar Nova Tarefa';
  const buttonText = isEditing ? 'Salvar Alterações' : 'Adicionar';

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{modalTitle}</h2>
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
          <button type="submit" className="btn-add">{buttonText}</button>
        </form>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default AddTaskModal;