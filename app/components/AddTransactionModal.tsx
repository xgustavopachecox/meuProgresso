import React, { useState } from 'react';
import './AddTransactionModal.css'; // Vamos criar logo abaixo

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { itemName: string | null; amount: number }) => void; 
  potesData: any[];
  type: 'entry' | 'exit'; // Define se é entrada ou saída
}

const AddTransactionModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, potesData, type }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const isEntry = type === 'entry';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação: Se for Saída, TEM que escolher um destino
    if (!isEntry && !selectedItem) {
      alert("Selecione para onde o dinheiro foi.");
      return;
    }
    if (!amount) {
      alert("Digite um valor.");
      return;
    }

    onSubmit({
      itemName: isEntry ? null : selectedItem, // Entrada não tem destino específico
      amount: parseFloat(amount)
    });

    // Limpa e fecha
    setAmount('');
    setSelectedItem('');
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
          
          {/* Só mostra o Select se for SAÍDA */}
          {!isEntry && (
            <div className="form-group">
              <label>Para onde foi o dinheiro?</label>
              <select 
                value={selectedItem} 
                onChange={(e) => setSelectedItem(e.target.value)}
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

          <div className="form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`modal-input-money ${isEntry ? 'text-entry' : 'text-exit'}`}
              autoFocus={isEntry} 
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