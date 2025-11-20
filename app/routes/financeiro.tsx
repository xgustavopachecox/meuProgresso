import { useState } from 'react';
import './financeiro.css';
import { 
  LuWallet, LuTrendingUp, LuShieldCheck, LuBriefcase, 
  LuUtensils, LuDumbbell, LuSmile, LuPlus, LuMinus,
  LuFuel, LuShoppingCart // <-- Novos ícones importados
} from 'react-icons/lu';
import AddTransactionModal from '../components/AddTransactionModal';

// --- DADOS INICIAIS ---
const INITIAL_POTES = [
  {
    id: 'metas',
    title: 'Pote Metas (Guardado)',
    total: 800.00,
    description: 'Dinheiro acumulado/investido.',
    colorClass: 'pot-metas',
    icon: <LuTrendingUp size={24} />,
    items: [
      { name: 'Reserva de Emergência', value: 300.00, desc: 'Guardado e rendendo', icon: <LuShieldCheck /> },
      { name: 'Investimentos LP', value: 200.00, desc: 'Foco no longo prazo', icon: <LuTrendingUp /> },
      { name: 'Capital para Negócio', value: 300.00, desc: 'Para seu projeto', icon: <LuBriefcase /> },
    ]
  },
  {
    id: 'essenciais',
    title: 'Pote Essenciais (Fixo)',
    total: 270.00,
    description: 'O custo para se manter de pé.',
    colorClass: 'pot-essenciais',
    icon: <LuWallet size={24} />,
    items: [
      { name: 'Alimentação', value: 200.00, desc: 'Ajuda em casa', icon: <LuUtensils /> },
      { name: 'Academia', value: 70.00, desc: 'Mensalidade', icon: <LuDumbbell /> },
    ]
  },
  {
    id: 'pessoal',
    title: 'Pote Pessoal (Livre)',
    total: 610.00,
    description: 'O que você gastou com você.',
    colorClass: 'pot-pessoal',
    icon: <LuSmile size={24} />,
    items: [
      { name: 'Lazer & Gastos', value: 610.00, desc: 'Livre para gastar', icon: <LuSmile /> },
    ]
  },
  // --- NOVO POTE DE VARIÁVEIS ---
  {
    id: 'variaveis',
    title: 'Variáveis & Transporte',
    total: 0.00, // Começa zerado ou com o que já gastou
    description: 'Combustível, Uber e imprevistos.',
    colorClass: 'pot-variaveis',
    icon: <LuFuel size={24} />,
    items: [
      { name: 'Combustível / Uber', value: 0.00, desc: 'Transporte em geral', icon: <LuFuel /> },
      { name: 'Outros / Imprevistos', value: 0.00, desc: 'Gastos não planejados', icon: <LuShoppingCart /> },
    ]
  }
];

export default function FinanceiroPage() {
  const [potes, setPotes] = useState(INITIAL_POTES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'entry' | 'exit'>('entry');
  
  // SALDO EM CAIXA
  const [saldoLivre, setSaldoLivre] = useState(0.00); 

  // DATA
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const openModal = (type: 'entry' | 'exit') => {
    setTransactionType(type);
    setIsModalOpen(true);
  };

  // --- LÓGICA PRINCIPAL ---
  const handleTransaction = (data: { itemName: string | null; amount: number }) => {
    
    if (transactionType === 'entry') {
      // ENTRADA
      setSaldoLivre(prev => prev + data.amount);
    } else {
      // SAÍDA
      setSaldoLivre(prev => prev - data.amount);

      const newPotes = potes.map(pote => {
        const itemIndex = pote.items.findIndex(item => item.name === data.itemName);
        
        if (itemIndex !== -1) {
          const updatedItems = [...pote.items];
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            value: updatedItems[itemIndex].value + data.amount
          };

          return {
            ...pote,
            items: updatedItems,
            total: pote.total + data.amount
          };
        }
        return pote;
      });
      setPotes(newPotes);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Financeiro</h1>
        <p className="finance-month">{monthYear}</p>
        <p>Controle de Fluxo de Caixa e Potes.</p>
      </header>

      {/* CARD DE SALDO */}
      <div className="finance-summary">
        <div className="income-card">
          <span className="income-label">Saldo em Caixa (Disponível)</span>
          <span className={`income-value ${saldoLivre < 0 ? 'negative' : ''}`}>
            {formatCurrency(saldoLivre)}
          </span>
        </div>
      </div>

      {/* GRID DOS POTES */}
      <div className="pots-grid">
        {potes.map(pote => (
          <div key={pote.id} className={`pot-card ${pote.colorClass}`}>
            <div className="pot-header">
              <div className="pot-title-row">
                {pote.icon}
                <h3>{pote.title}</h3>
              </div>
              <div className="pot-total">
                {formatCurrency(pote.total)}
              </div>
              <p className="pot-description">{pote.description}</p>
            </div>

            <div className="pot-items-list">
              {pote.items.map((item, index) => (
                <div key={index} className="pot-item">
                  <div className="item-icon-wrapper">
                    {item.icon}
                  </div>
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-desc">{item.desc}</span>
                  </div>
                  <div className="item-value">
                    {formatCurrency(item.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="finance-actions-container">
        <button className="btn-action btn-entry" onClick={() => openModal('entry')}>
          <LuPlus size={24} />
          <span>Entrada</span>
        </button>
        <button className="btn-action btn-exit" onClick={() => openModal('exit')}>
          <LuMinus size={24} />
          <span>Saída</span>
        </button>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        potesData={potes}
        onSubmit={handleTransaction}
        type={transactionType}
      />
    </div>
  );
}