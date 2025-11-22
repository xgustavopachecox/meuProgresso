import React from 'react';
import './DietPlanModal.css';
import { LuUtensils, LuClock, LuFlame, LuBeef, LuWheat, LuDroplets, LuCalculator } from 'react-icons/lu';

// --- SEU PLANO ALIMENTAR ---
const MY_DIET_PLAN = [
  {
    meal: 'Café da Manhã',
    time: '06:30',
    macros: { kcal: 750, p: 36, c: 84, f: 32 },
    items: [
      { name: 'Pão Integral', amount: '100g (4 fatias)' },
      { name: 'Ovos Mexidos', amount: '4 unidades' },
      { name: 'Azeite de Oliva', amount: '10ml' },
      { name: 'Banana', amount: '150g' }
    ]
  },
  {
    meal: 'Almoço',
    time: '11:00',
    macros: { kcal: 980, p: 57, c: 157, f: 12 },
    items: [
      { name: 'Arroz Cozido', amount: '350g' },
      { name: 'Feijão', amount: '200g' },
      { name: 'Frango/Carne Magra', amount: '150g' },
      { name: 'Batata/Aipim', amount: '150g' },
      { name: 'Azeite (Salada)', amount: '10ml' }
    ]
  },
  {
    meal: 'Shake (Trabalho)',
    time: '14:30',
    macros: { kcal: 520, p: 13, c: 88, f: 16 },
    items: [
      { name: 'Água/Água de Coco', amount: '400ml' },
      { name: 'Aveia em Flocos', amount: '80g' },
      { name: 'Banana', amount: '150g' },
      { name: 'Azeite (no shake)', amount: '10ml' }
    ]
  },
  {
    meal: 'Jantar (Pós-Treino)',
    time: '19:00',
    macros: { kcal: 770, p: 44, c: 125, f: 10 },
    items: [
      { name: 'Arroz Cozido', amount: '300g' },
      { name: 'Carne Moída (Patinho)', amount: '150g' },
      { name: 'Purê de Batata', amount: '200g' }
    ]
  },
  {
    meal: 'Lanche / Ceia',
    time: '20:30',
    macros: { kcal: 370, p: 20, c: 10, f: 30 },
    items: [
      { name: 'Ovos Cozidos', amount: '3 unidades' },
      { name: 'Abacate', amount: '100g' }
    ]
  }
];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DietPlanModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // CÁLCULO AUTOMÁTICO DOS TOTAIS
  const totals = MY_DIET_PLAN.reduce((acc, meal) => ({
    kcal: acc.kcal + meal.macros.kcal,
    p: acc.p + meal.macros.p,
    c: acc.c + meal.macros.c,
    f: acc.f + meal.macros.f,
  }), { kcal: 0, p: 0, c: 0, f: 0 });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content plan-modal" onClick={(e) => e.stopPropagation()}>
        
        <header className="modal-header">
          <div className="header-title">
            <LuUtensils size={24} style={{ color: '#1DB954' }} />
            <h2>Meu Plano Alimentar</h2>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </header>

        <div className="modal-body plan-body">
          
          <div className="plan-list">
            {MY_DIET_PLAN.map((meal, index) => (
              <div key={index} className="plan-card">
                <div className="plan-card-header">
                  <span className="plan-meal-name">{index + 1}. {meal.meal}</span>
                  <span className="plan-time"><LuClock size={14}/> {meal.time}</span>
                </div>
                
                <div className="plan-content-grid">
                  <ul className="plan-items">
                    {meal.items.map((item, i) => (
                      <li key={i}>
                        <span className="item-name">{item.name}</span>
                        <span className="item-dots"></span>
                        <span className="item-amount">{item.amount}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="plan-macros-row">
                    <div className="plan-macro kcal"><LuFlame size={12} /> {meal.macros.kcal}</div>
                    <div className="plan-macro prot"><LuBeef size={12} /> {meal.macros.p}g</div>
                    <div className="plan-macro carb"><LuWheat size={12} /> {meal.macros.c}g</div>
                    <div className="plan-macro fat"><LuDroplets size={12} /> {meal.macros.f}g</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- SEÇÃO DE TOTAL --- */}
          <div className="plan-total-section">
            <div className="plan-total-header">
              <LuCalculator size={20} />
              <h3>Total Diário Estimado</h3>
            </div>
            <div className="plan-total-grid">
              <div className="total-item">
                <span className="total-label">Calorias</span>
                <span className="total-value kcal">{totals.kcal}</span>
              </div>
              <div className="total-item">
                <span className="total-label">Proteína</span>
                <span className="total-value prot">{totals.p}g</span>
              </div>
              <div className="total-item">
                <span className="total-label">Carbo</span>
                <span className="total-value carb">{totals.c}g</span>
              </div>
              <div className="total-item">
                <span className="total-label">Gordura</span>
                <span className="total-value fat">{totals.f}g</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DietPlanModal;