import { useState, useEffect } from 'react';
import './financeiro.css';
import { 
  LuWallet, LuTrendingUp, LuShieldCheck, LuBriefcase, 
  LuUtensils, LuDumbbell, LuSmile, LuPlus, LuMinus,
  LuFuel, LuShoppingCart, LuTag, LuChevronLeft, LuChevronRight 
} from 'react-icons/lu';
import AddTransactionModal from '../components/AddTransactionModal';

// --- DADOS INICIAIS (TEMPLATE) ---
// Usamos isso para criar um mês novo zerado
const INITIAL_POTES_TEMPLATE = [
  {
    id: 'metas',
    title: 'Pote Metas (Guardado)',
    description: 'Dinheiro acumulado/investido.',
    colorClass: 'pot-metas',
    icon: <LuTrendingUp size={24} />,
    items: [
      { name: 'Reserva de Emergência', value: 0.00, goal: 300.00, desc: 'Guardado e rendendo', icon: <LuShieldCheck /> },
      { name: 'Investimentos LP', value: 0.00, goal: 200.00, desc: 'Foco no longo prazo', icon: <LuTrendingUp /> },
      { name: 'Capital para Negócio', value: 0.00, goal: 300.00, desc: 'Para seu projeto', icon: <LuBriefcase /> },
    ]
  },
  {
    id: 'essenciais',
    title: 'Pote Essenciais (Gastos)',
    description: 'O custo para se manter de pé.',
    colorClass: 'pot-essenciais',
    icon: <LuWallet size={24} />,
    items: [
      { name: 'Alimentação', value: 0.00, goal: 200.00, desc: 'Ajuda em casa', icon: <LuUtensils /> },
      { name: 'Academia', value: 0.00, goal: 70.00, desc: 'Mensalidade', icon: <LuDumbbell /> },
    ]
  },
  {
    id: 'pessoal',
    title: 'Pote Pessoal (Livre)',
    description: 'O que você gastou com você.',
    colorClass: 'pot-pessoal',
    icon: <LuSmile size={24} />,
    items: [
      { name: 'Lazer & Gastos', value: 0.00, goal: 610.00, desc: 'Livre para gastar', icon: <LuSmile /> },
    ]
  },
  {
    id: 'variaveis',
    title: 'Variáveis & Transporte',
    description: 'Combustível, Uber e imprevistos.',
    colorClass: 'pot-variaveis',
    icon: <LuFuel size={24} />,
    items: [
      { name: 'Novo Gasto Variável...', value: 0.00, goal: 0, desc: 'Clique para registrar', icon: <LuPlus /> },
    ]
  }
];

// Tipo para os dados de UM mês
interface MonthData {
  saldoLivre: number;
  potes: typeof INITIAL_POTES_TEMPLATE;
}

export default function FinanceiroPage() {
  // Data atual selecionada (Visualização)
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // ESTADO GLOBAL: Guarda todos os meses. 
  // Chave: "2025-11" -> Valor: { saldoLivre: 100, potes: [...] }
  const [allMonthsData, setAllMonthsData] = useState<Record<string, MonthData>>({});

  // Modais e Controles
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'entry' | 'exit'>('entry');

  // --- HELPER: Gera a chave do mês (ex: "2025-10") ---
  const getMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;
  const currentKey = getMonthKey(currentDate);

  // --- RECUPERA OS DADOS DO MÊS ATUAL ---
  // Se não existir dados para este mês, usa o Template Zerado
  const currentData = allMonthsData[currentKey] || {
    saldoLivre: 0.00,
    potes: INITIAL_POTES_TEMPLATE
  };

  // Formatadores
  const monthYearString = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // --- NAVEGAÇÃO DE DATA ---
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const openModal = (type: 'entry' | 'exit') => {
    setTransactionType(type);
    setIsModalOpen(true);
  };

  // --- LÓGICA PRINCIPAL ---
  const handleTransaction = (data: { itemName: string | null; amount: number; customName?: string }) => {
    
    // Vamos criar uma cópia dos dados do mês atual (ou criar um novo objeto se for o primeiro registro)
    const prevData = allMonthsData[currentKey] || { saldoLivre: 0.00, potes: INITIAL_POTES_TEMPLATE };
    
    let newSaldo = prevData.saldoLivre;
    let newPotes = [...prevData.potes]; // Cópia rasa do array de potes

    if (transactionType === 'entry') {
      // ENTRADA
      newSaldo += data.amount;
    } else {
      // SAÍDA
      newSaldo -= data.amount;

      // Atualiza os potes (Cria uma cópia profunda dos itens para não afetar o template original)
      newPotes = newPotes.map(pote => {
        // Lógica de Variáveis (Novo Item)
        if (data.customName && pote.id === 'variaveis') {
          const newItem = {
            name: data.customName,
            value: data.amount,
            goal: 0,
            desc: 'Gasto Variável',
            icon: <LuTag />
          };
          return { ...pote, items: [newItem, ...pote.items] };
        }

        // Lógica de Item Fixo (Atualizar)
        const itemIndex = pote.items.findIndex(item => item.name === data.itemName);
        if (itemIndex !== -1 && !data.customName) {
          const updatedItems = pote.items.map((item, idx) => {
            if (idx === itemIndex) {
              return { ...item, value: item.value + data.amount };
            }
            return item;
          });
          return { ...pote, items: updatedItems };
        }
        return pote;
      });
    }

    // SALVA NO ESTADO GLOBAL, NA CHAVE DO MÊS CERTO
    setAllMonthsData({
      ...allMonthsData,
      [currentKey]: {
        saldoLivre: newSaldo,
        potes: newPotes
      }
    });
  };

  return (
    <div className="page-container">
      
      {/* HEADER DE NAVEGAÇÃO */}
      <header className="page-header date-navigator">
        <button className="date-nav-btn" onClick={() => changeMonth(-1)}>
          <LuChevronLeft size={24} />
        </button>
        
        <div className="header-text-center">
          <h1>Financeiro</h1>
          <p className="finance-month">{monthYearString}</p>
        </div>

        <button className="date-nav-btn" onClick={() => changeMonth(1)}>
          <LuChevronRight size={24} />
        </button>
      </header>

      {/* CARD DE SALDO */}
      <div className="finance-summary">
        <div className="income-card">
          <span className="income-label">Saldo Disponível em {currentDate.toLocaleDateString('pt-BR', { month: 'long' })}</span>
          <span className={`income-value ${currentData.saldoLivre < 0 ? 'negative' : ''}`}>
            {formatCurrency(currentData.saldoLivre)}
          </span>
        </div>
      </div>

      {/* GRID DOS POTES */}
      <div className="pots-grid">
        {currentData.potes.map((pote: any) => {
          const potCurrent = pote.items.reduce((acc: number, item: any) => acc + item.value, 0);
          const potGoal = pote.items.reduce((acc: number, item: any) => acc + (item.goal || 0), 0);
          const showGoalHeader = potGoal > 0;

          return (
            <div key={pote.id} className={`pot-card ${pote.colorClass}`}>
              <div className="pot-header">
                <div className="pot-title-row">
                  {pote.icon}
                  <h3>{pote.title}</h3>
                </div>
                <div className="pot-total">
                  {formatCurrency(potCurrent)} 
                  {showGoalHeader && <span className="pot-goal-text"> / {formatCurrency(potGoal)}</span>}
                </div>
                <p className="pot-description">{pote.description}</p>
              </div>

              <div className="pot-items-list">
                {pote.items.map((item: any, index: number) => (
                  <div key={index} className="pot-item">
                    <div className="item-icon-wrapper">
                      {item.icon || <LuWallet />} {/* Fallback icon */}
                    </div>
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-desc">{item.desc}</span>
                    </div>
                    <div className="item-value-container">
                      <div className="item-value">
                        {formatCurrency(item.value)}
                      </div>
                      {item.goal > 0 && (
                        <div className="item-goal-info">
                          <span className="item-goal-text">/ {formatCurrency(item.goal)}</span>
                          <div className="item-progress-bar">
                            <div 
                              className="item-progress-fill" 
                              style={{ width: `${Math.min((item.value / item.goal) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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
        // Passamos os potes ATUAIS para o modal saber o que mostrar no select
        potesData={currentData.potes} 
        onSubmit={handleTransaction}
        type={transactionType}
      />
    </div>
  );
}