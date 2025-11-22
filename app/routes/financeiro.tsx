import { useState, useEffect } from 'react';
import './financeiro.css';
import { 
  LuWallet, LuTrendingUp, LuShieldCheck, LuBriefcase, 
  LuUtensils, LuDumbbell, LuSmile, LuPlus, LuMinus,
  LuFuel, LuShoppingCart, LuTag 
} from 'react-icons/lu';
import AddTransactionModal from '../components/AddTransactionModal';
import api from '../services/api'; // <-- CONEXÃO COM O BACKEND

// --- DADOS INICIAIS (TEMPLATE) ---
const INITIAL_POTES = [
  {
    id: 'metas',
    title: 'Pote Metas (Guardado)',
    description: 'Dinheiro acumulado/investido.',
    colorClass: 'pot-metas',
    iconName: 'TrendingUp', // Trocamos o componente direto por string pra salvar no banco
    items: [
      { name: 'Reserva de Emergência', value: 0.00, goal: 300.00, desc: 'Guardado e rendendo', iconName: 'ShieldCheck' },
      { name: 'Investimentos LP', value: 0.00, goal: 200.00, desc: 'Foco no longo prazo', iconName: 'TrendingUp' },
      { name: 'Capital para Negócio', value: 0.00, goal: 300.00, desc: 'Para seu projeto', iconName: 'Briefcase' },
    ]
  },
  {
    id: 'essenciais',
    title: 'Pote Essenciais (Gastos)',
    description: 'O custo para se manter de pé.',
    colorClass: 'pot-essenciais',
    iconName: 'Wallet',
    items: [
      { name: 'Alimentação', value: 0.00, goal: 200.00, desc: 'Ajuda em casa', iconName: 'Utensils' },
      { name: 'Academia', value: 0.00, goal: 70.00, desc: 'Mensalidade', iconName: 'Dumbbell' },
    ]
  },
  {
    id: 'pessoal',
    title: 'Pote Pessoal (Livre)',
    description: 'O que você gastou com você.',
    colorClass: 'pot-pessoal',
    iconName: 'Smile',
    items: [
      { name: 'Lazer & Gastos', value: 0.00, goal: 610.00, desc: 'Livre para gastar', iconName: 'Smile' },
    ]
  },
  {
    id: 'variaveis',
    title: 'Variáveis & Transporte',
    description: 'Combustível, Uber e imprevistos.',
    colorClass: 'pot-variaveis',
    iconName: 'Fuel',
    items: [
      { name: 'Novo Gasto Variável...', value: 0.00, goal: 0, desc: 'Clique para registrar', iconName: 'Plus' },
    ]
  }
];

// Helper para renderizar ícones dinamicamente
const getIcon = (name: string) => {
  const size = 24;
  switch(name) {
    case 'TrendingUp': return <LuTrendingUp size={size} />;
    case 'ShieldCheck': return <LuShieldCheck size={size} />;
    case 'Briefcase': return <LuBriefcase size={size} />;
    case 'Wallet': return <LuWallet size={size} />;
    case 'Utensils': return <LuUtensils size={size} />;
    case 'Dumbbell': return <LuDumbbell size={size} />;
    case 'Smile': return <LuSmile size={size} />;
    case 'Fuel': return <LuFuel size={size} />;
    case 'ShoppingCart': return <LuShoppingCart size={size} />;
    case 'Tag': return <LuTag size={size} />;
    case 'Plus': return <LuPlus size={size} />;
    default: return <LuWallet size={size} />;
  }
};

export default function FinanceiroPage() {
  const [potes, setPotes] = useState<any[]>([]); // Começa vazio, carrega do banco
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'entry' | 'exit'>('entry');
  const [saldoLivre, setSaldoLivre] = useState(0.00); 

  // 1. CARREGAR DADOS AO INICIAR
  useEffect(() => {
    // Carregar saldo do localStorage (solução simples pra saldo)
    const savedSaldo = localStorage.getItem('saldoLivre');
    if (savedSaldo) setSaldoLivre(parseFloat(savedSaldo));

    // Carregar potes do Banco de Dados
    api.get('/pots')
      .then(response => {
        if (response.data.length === 0) {
          // SE O BANCO TIVER VAZIO: Inicializa com o template
          console.log("Banco vazio. Inicializando dados padrão...");
          initializeDatabase();
        } else {
          setPotes(response.data);
        }
      })
      .catch(err => console.error("Erro ao carregar potes:", err));
  }, []);

  // Função para salvar os dados padrão no banco pela primeira vez
  const initializeDatabase = async () => {
    const promises = INITIAL_POTES.map(pote => api.post('/pots', pote));
    await Promise.all(promises);
    // Recarrega do banco para garantir que temos os IDs certos se necessário
    const response = await api.get('/pots');
    setPotes(response.data);
  };

  // Salva o saldo no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('saldoLivre', saldoLivre.toString());
  }, [saldoLivre]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const openModal = (type: 'entry' | 'exit') => {
    setTransactionType(type);
    setIsModalOpen(true);
  };

  const handleTransaction = (data: { itemName: string | null; amount: number; customName?: string }) => {
    if (transactionType === 'entry') {
      setSaldoLivre(prev => prev + data.amount);
    } else {
      setSaldoLivre(prev => prev - data.amount);

      const newPotes = potes.map(pote => {
        // Variáveis (Novo Item)
        if (data.customName && pote.id === 'variaveis') {
          const newItem = {
            name: data.customName,
            value: data.amount,
            goal: 0,
            desc: 'Gasto Variável',
            iconName: 'Tag' // Salva a string do nome do ícone
          };
          
          const updatedPote = { ...pote, items: [newItem, ...pote.items], total: pote.total + data.amount };
          
          // SALVA NO BANCO DE DADOS
          api.post('/pots', updatedPote).catch(err => console.error("Erro ao salvar:", err));
          
          return updatedPote;
        }

        // Item Fixo (Atualizar)
        const itemIndex = pote.items.findIndex((item: any) => item.name === data.itemName);
        if (itemIndex !== -1 && !data.customName) {
          const updatedItems = [...pote.items];
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            value: updatedItems[itemIndex].value + data.amount
          };
          
          const updatedPote = { ...pote, items: updatedItems, total: pote.total + data.amount };

          // SALVA NO BANCO DE DADOS
          api.post('/pots', updatedPote).catch(err => console.error("Erro ao salvar:", err));

          return updatedPote;
        }
        return pote;
      });
      setPotes(newPotes);
    }
  };

  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Financeiro</h1>
        <p className="finance-month">{monthYear}</p>
        <p>Controle de Fluxo de Caixa e Potes.</p>
      </header>

      <div className="finance-summary">
        <div className="income-card">
          <span className="income-label">Saldo em Caixa (Disponível)</span>
          <span className={`income-value ${saldoLivre < 0 ? 'negative' : ''}`}>
            {formatCurrency(saldoLivre)}
          </span>
        </div>
      </div>

      <div className="pots-grid">
        {potes.map(pote => {
          // Recalcula totais para garantir visualização
          const potCurrent = pote.items ? pote.items.reduce((acc: number, item: any) => acc + item.value, 0) : 0;
          const potGoal = pote.items ? pote.items.reduce((acc: number, item: any) => acc + (item.goal || 0), 0) : 0;
          const showGoalHeader = potGoal > 0;

          return (
            <div key={pote.id} className={`pot-card ${pote.colorClass}`}>
              <div className="pot-header">
                <div className="pot-title-row">
                  {getIcon(pote.iconName)}
                  <h3>{pote.title}</h3>
                </div>
                <div className="pot-total">
                  {formatCurrency(potCurrent)} 
                  {showGoalHeader && <span className="pot-goal-text"> / {formatCurrency(potGoal)}</span>}
                </div>
                <p className="pot-description">{pote.description}</p>
              </div>

              <div className="pot-items-list">
                {pote.items && pote.items.map((item: any, index: number) => (
                  <div key={index} className="pot-item">
                    <div className="item-icon-wrapper">
                      {getIcon(item.iconName)}
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