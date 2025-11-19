import React, { useState, useEffect } from 'react';
import './AddExerciseModal.css';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary'; // 1. IMPORTAR A BIBLIOTECA

export interface ExerciseData {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  imageUrl?: string;
}

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exercise: ExerciseData) => void;
  initialData?: ExerciseData | null;
}

export default function AddExerciseModal({ isOpen, onClose, onSubmit, initialData }: AddExerciseModalProps) {
  const [name, setName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [rest, setRest] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSets(String(initialData.sets));
      setReps(initialData.reps);
      setRest(initialData.rest);
      setNotes(initialData.notes || '');
      setImageUrl(initialData.imageUrl || '');
    } else {
      setName('');
      setSets('');
      setReps('');
      setRest('');
      setNotes('');
      setImageUrl('');
    }
  }, [initialData, isOpen]);

  // 2. FUNÇÃO PARA CARREGAR DO BANCO DE DADOS
  const handleLibrarySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const exerciseFromLib = EXERCISE_LIBRARY.find(ex => ex.id === selectedId);
    if (exerciseFromLib) {
      setName(exerciseFromLib.name);
      setSets(String(exerciseFromLib.defaultSets));
      setReps(exerciseFromLib.defaultReps);
      setRest(exerciseFromLib.defaultRest);
      setImageUrl(exerciseFromLib.imageUrl || '');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sets || !reps || !rest) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newExercise: ExerciseData = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      sets: parseInt(sets),
      reps,
      rest,
      notes: notes || undefined,
      imageUrl: imageUrl || undefined,
    };
    onSubmit(newExercise);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{initialData ? 'Editar Exercício' : 'Adicionar Novo Exercício'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </header>
        
        <form onSubmit={handleSubmit} className="exercise-form">
          
          {/* 3. SELECT DO BANCO DE DADOS (Só aparece se estiver criando um novo) */}
          {!initialData && (
            <div className="form-group library-select-group">
              <label style={{ color: '#1DB954' }}>Biblioteca de Exercícios (Rápido)</label>
              <select onChange={handleLibrarySelect} defaultValue="">
                <option value="" disabled>Selecione para preencher auto...</option>
                {EXERCISE_LIBRARY.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* O resto do formulário continua igual */}
          <div className="form-group">
            <label htmlFor="exercise-name">Nome do Exercício</label>
            <input
              id="exercise-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Supino Reto com Halteres"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="exercise-sets">Séries</label>
              <input
                id="exercise-sets"
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                placeholder="Ex: 3"
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="exercise-reps">Repetições</label>
              <input
                id="exercise-reps"
                type="text"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="Ex: 8-12"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="exercise-rest">Descanso</label>
              <input
                id="exercise-rest"
                type="text"
                value={rest}
                onChange={(e) => setRest(e.target.value)}
                placeholder="Ex: 60s"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="exercise-notes">Anotações (Opcional)</label>
            <textarea
              id="exercise-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Fazer com pegada neutra ou máquina"
              rows={3}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exercise-image">URL da Imagem (Opcional)</label>
            <input
              id="exercise-image"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Ex: https://example.com/supino.jpg"
            />
            {imageUrl && (
              <div className="image-preview">
                <img src={imageUrl} alt="Prévia do Exercício" onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150?text=Imagem+N%C3%A3o+Carregada';
                }} />
              </div>
            )}
          </div>
          <button type="submit" className="btn-primary">
            {initialData ? 'Salvar Edições' : 'Adicionar Exercício'}
          </button>
        </form>
      </div>
    </div>
  );
}