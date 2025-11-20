import React, { useState, useEffect } from 'react';
import './AddTransactionModal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Adicionamos 'customName' na resposta
  onSubmit: (data: { itemName: string | null; amount: number; customName?: string }) => void;
  potesData: any[];
  type: 'entry' | 'exit';
}

const AddTransactionModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, potesData, type }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [amount, setAmount] = useState('');
  
  // Novo estado para o nome personalizado
  const [customName, setCustomName] = useState('');
  // Estado para saber se o item selecionado pertence ao pote de Variáveis
  const [isVariableExpense, setIsVariableExpense] = useState(false);

  // Reseta quando abre/fecha
  useEffect(() => {
    if (isOpen) {
      setSelectedItem('');
      setAmount('');
      setCustomName('');
      setIsVariableExpense(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isEntry = type === 'entry';

  // Função para verificar se o item selecionado é do pote "variaveis"
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedItem(value);

    // Procura em qual pote está esse item
    const parentPot = potesData.find(pote => 
      pote.items.some((item: any) => item.name === value)
    );

    // Se for do pote 'variaveis', habilita o campo de nome personalizado
    if (parentPot && parentPot.id === 'variaveis') {
      setIsVariableExpense(true);
    } else {
      setIsVariableExpense(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEntry && !selectedItem) {
      alert("Selecione o destino.");
      return;
    }
    if (!amount) {
      alert("Digite um valor.");
      return;
    }
    // Se for variável, exige o nome
    if (isVariableExpense && !customName) {
      alert("Digite uma descrição para este gasto variável.");
      return;
    }

    onSubmit({
      itemName: isEntry ? null : selectedItem,
      amount: parseFloat(amount),
      customName: isVariableExpense ? customName : undefined // Manda o nome novo se tiver
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <header className={`modal-header ${isEntry ? 'header-entry' : 'header-exit'}`}>
          <h2>{isEntry ? 'Nova Entrada (+)' : 'Registrar Saída (-)'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </header>

        <form onSubmit={handleSubmit} className="transaction-form">
          
          {!isEntry && (
            <div className="form-group">
              <label>Para onde foi o dinheiro?</label>
              <select 
                value={selectedItem} 
                onChange={handleSelectChange}
                className="modal-select"
                autoFocus
              >
                <option value="" disabled>Selecione o destino...</option>
                {potesData.map(pote => (
                  <optgroup key={pote.id} label={pote.title}>
                    {pote.items.map((item: any) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}

          {/* --- NOVO CAMPO: SÓ APARECE SE FOR VARIÁVEL --- */}
          {isVariableExpense && (
            <div className="form-group">
              <label style={{ color: '#d946ef' }}>Descrição do Gasto (Variável)</label>
              <input
                type="text"
                placeholder="Ex: Uber, Pizza, Farmácia..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="modal-select" // Reutilizando o estilo do input de texto
                autoFocus // Foca aqui quando aparecer
              />
            </div>
          )}
          {/* --------------------------------------------- */}

          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`modal-input-money ${isEntry ? 'text-entry' : 'text-exit'}`}
            />
          </div>

          <button 
            type="submit" 
            className={`btn-confirm ${isEntry ? 'btn-entry' : 'btn-exit'}`}
          >
            {isEntry ? 'Adicionar ao Caixa' : 'Confirmar Saída'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;