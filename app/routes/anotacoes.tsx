import { useState } from 'react';
import './anotacoes.css';
import { 
  LuStickyNote, LuCheck, LuPlus, LuTrash2, LuX, LuPalette
} from 'react-icons/lu';

// --- TIPOS ---
interface Note {
  id: number;
  title: string;
  content: string;
  color: string; // 'blue', 'yellow', 'green', 'purple', 'gray'
  date: string;
}

interface GeneralTask {
  id: number;
  text: string;
  done: boolean;
}

// --- DADOS INICIAIS ---
const INITIAL_NOTES: Note[] = [
  { id: 1, title: 'Ideia de App', content: 'Fazer um app que conecta personal trainers a alunos via geolocalização.', color: 'blue', date: '20/11' },
  { id: 2, title: 'Lista de Compras Mensal', content: '- Arroz 5kg\n- Whey\n- Frango\n- Papel Toalha', color: 'yellow', date: '18/11' },
];

const INITIAL_TASKS: GeneralTask[] = [
  { id: 1, text: 'Renovar carteira de motorista', done: false },
  { id: 2, text: 'Pesquisar preço de notebook novo', done: true },
  { id: 3, text: 'Marcar dentista', done: false },
];

// Cores disponíveis para as notas
const NOTE_COLORS = [
  { id: 'gray', value: '#27272a' },   // Padrão
  { id: 'blue', value: '#1e3a8a' },   // Azul
  { id: 'yellow', value: '#854d0e' }, // Amarelo/Laranja (Dark)
  { id: 'green', value: '#14532d' },  // Verde
  { id: 'purple', value: '#581c87' }, // Roxo
];

export default function AnotacoesPage() {
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  // Estados do Modal de Notas
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('gray'); // Cor padrão

  // Estados de Tarefas
  const [newTaskText, setNewTaskText] = useState('');

  // --- FUNÇÕES DE NOTAS ---
  const openNoteModal = () => {
    setNewNoteTitle('');
    setNewNoteContent('');
    setSelectedColor('gray');
    setIsNoteModalOpen(true);
  };

  const handleAddNote = () => {
    if (!newNoteTitle && !newNoteContent) return;
    
    const newNote: Note = {
      id: Date.now(),
      title: newNoteTitle || 'Sem título',
      content: newNoteContent,
      color: selectedColor,
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    };
    
    setNotes([newNote, ...notes]);
    setIsNoteModalOpen(false);
  };

  const handleDeleteNote = (id: number) => {
    if(confirm("Excluir nota?")) setNotes(notes.filter(n => n.id !== id));
  };

  // --- FUNÇÕES DE TAREFAS ---
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: GeneralTask = {
      id: Date.now(),
      text: newTaskText,
      done: false
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Caderno & Tarefas</h1>
        <p>Guarde suas ideias e organize suas pendências gerais.</p>
      </header>

      {/* --- NAVEGAÇÃO DE ABAS --- */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <LuStickyNote size={20} /> Minhas Anotações
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <LuCheck size={20} /> Coisas a Fazer
        </button>
      </div>

      {/* --- CONTEÚDO: ANOTAÇÕES --- */}
      {activeTab === 'notes' && (
        <div className="notes-section">
          
          {/* Botão de Criar Nota Rápida */}
          <div className="create-note-bar" onClick={openNoteModal}>
            <div className="placeholder-text">
              <LuPlus size={24} />
              <span>Criar nova nota...</span>
            </div>
          </div>

          <div className="notes-grid">
            {notes.map(note => (
              <div key={note.id} className={`note-card ${note.color}`}>
                <div className="note-header">
                  <h3>{note.title}</h3>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}>
                    <LuTrash2 size={16} />
                  </button>
                </div>
                <p className="note-content">{note.content}</p>
                <span className="note-date">{note.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CONTEÚDO: TAREFAS --- */}
      {activeTab === 'tasks' && (
        <div className="tasks-section">
          <form onSubmit={handleAddTask} className="add-task-form">
            <input 
              type="text" 
              placeholder="O que você precisa fazer?" 
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
            />
            <button type="submit" className="btn-add-task">
              <LuPlus size={24} />
            </button>
          </form>

          <div className="general-tasks-list">
            {tasks.map(task => (
              <div key={task.id} className={`general-task-item ${task.done ? 'done' : ''}`}>
                <div className="task-left" onClick={() => toggleTask(task.id)}>
                  <div className="checkbox-custom">
                    {task.done && <LuX size={14} style={{color: '#000'}} />} 
                  </div>
                  <span>{task.text}</span>
                </div>
                <button className="btn-delete-task" onClick={() => handleDeleteTask(task.id)}>
                  <LuTrash2 size={18} />
                </button>
              </div>
            ))}
            {tasks.length === 0 && <p className="empty-state">Nenhuma tarefa pendente.</p>}
          </div>
        </div>
      )}

      {/* --- MODAL DE CRIAR NOTA (REFEITO) --- */}
      {isNoteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNoteModalOpen(false)}>
          <div className="modal-content note-modal" onClick={e => e.stopPropagation()}>
            
            <header className="modal-header">
              <h2>Nova Anotação</h2>
              <button className="close-button" onClick={() => setIsNoteModalOpen(false)}>×</button>
            </header>
            
            <div className="modal-body">
              <div className="note-form">
                <div className="form-group">
                  <label>Título</label>
                  <input 
                    type="text" 
                    placeholder="Sobre o que é essa nota?" 
                    value={newNoteTitle}
                    onChange={e => setNewNoteTitle(e.target.value)}
                    autoFocus
                    className="input-styled"
                  />
                </div>
                
                <div className="form-group">
                  <label>Conteúdo</label>
                  <textarea 
                    placeholder="Escreva suas ideias..." 
                    value={newNoteContent}
                    onChange={e => setNewNoteContent(e.target.value)}
                    className="textarea-styled"
                  />
                </div>

                <div className="form-group">
                  <label className="label-color"><LuPalette size={16}/> Cor do Cartão</label>
                  <div className="color-selector">
                    {NOTE_COLORS.map(c => (
                      <div 
                        key={c.id}
                        className={`color-circle ${selectedColor === c.id ? 'selected' : ''}`}
                        style={{ backgroundColor: c.value }}
                        onClick={() => setSelectedColor(c.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <footer className="modal-footer">
              <button className="btn-primary" onClick={handleAddNote}>
                Salvar Nota
              </button>
            </footer>

          </div>
        </div>
      )}

    </div>
  );
}