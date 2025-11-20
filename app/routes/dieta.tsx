import { useState, useMemo, useEffect } from 'react';
import './dieta.css';
import AddFoodModal from '../components/AddFoodModal';
import { LuPlus, LuChevronDown, LuChevronRight, LuChevronLeft } from 'react-icons/lu';

// IMPORTAÇÃO DOS NOVOS WIDGETS
import WeeklyDietChart from '../components/WeeklyDietChart';
import HydrationWidget from '../components/HydrationWidget';

// --- NOSSOS TIPOS DE DADOS ---
interface FoodData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
interface MealsState {
  [mealName: string]: FoodData[];
}
// ------------------------------

// --- DADOS SIMULADOS ---
const METAS_DIARIAS = {
  calorias: 3200,
  proteinas: 180,
  carboidratos: 450,
  gorduras: 100,
};

const REFEICOES_PADRAO = [
  { id: 1, name: 'Café da Manhã' },
  { id: 2, name: 'Almoço' },
  { id: 3, name: 'Lanche da Tarde' },
  { id: 4, name: 'Janta' },
];

// Nossos dados para "Hoje" (começa vazio)
const MOCK_MEALS_STATE_TODAY: MealsState = {
  "Café da Manhã": [],
  "Almoço": [],
  "Lanche da Tarde": [],
  "Janta": [],
};

// Nossos dados FALSOS para "Ontem" (só para ver a mudança ao navegar)
const MOCK_MEALS_STATE_YESTERDAY: MealsState = {
  "Café da Manhã": [
    { name: "Ovos Mexidos (3)", calories: 210, protein: 18, carbs: 1, fat: 15 },
  ],
  "Almoço": [
    { name: "Peito de Frango (200g)", calories: 330, protein: 62, carbs: 0, fat: 7 },
    { name: "Arroz Branco (200g)", calories: 260, protein: 5, carbs: 58, fat: 0 },
    { name: "Feijão (100g)", calories: 130, protein: 9, carbs: 24, fat: 1 },
  ],
  "Lanche da Tarde": [
    { name: "Whey Protein (1 scoop)", calories: 120, protein: 25, carbs: 3, fat: 1 },
  ],
  "Janta": [
    { name: "Salmão Grelhado (150g)", calories: 310, protein: 30, carbs: 0, fat: 20 },
  ],
};
// --------------------------

// --- FUNÇÃO HELPER ---
const isDateToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};
// ---------------------

export default function DietaPage() {
  // --- NOSSOS ESTADOS ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState<MealsState>(MOCK_MEALS_STATE_TODAY);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMealName, setCurrentMealName] = useState('');
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  // --- BACKEND FAKE ---
  useEffect(() => {
    const todayStr = (new Date()).toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (currentDate.toDateString() === todayStr) {
      setMeals(MOCK_MEALS_STATE_TODAY);
    } else if (currentDate.toDateString() === yesterdayStr) {
      setMeals(MOCK_MEALS_STATE_YESTERDAY);
    } else {
      setMeals(MOCK_MEALS_STATE_TODAY);
    }
    setExpandedMeal(null); 
  }, [currentDate]);

  // --- CÁLCULOS ---
  const totalConsumed = useMemo(() => {
    let totals: { calorias: number; proteinas: number; carboidratos: number; gorduras: number } = 
      { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 };
      
    for (const mealName in meals) {
      meals[mealName].forEach(food => {
        totals.calorias += food.calories;
        totals.proteinas += food.protein;
        totals.carboidratos += food.carbs;
        totals.gorduras += food.fat;
      });
    }
    return totals;
  }, [meals]);

  const getRemaining = (goal: number, consumed: number) => {
    const remaining = goal - consumed;
    return remaining < 0 ? 0 : remaining;
  };
  const remainingProtein = getRemaining(METAS_DIARIAS.proteinas, totalConsumed.proteinas);
  const remainingCarbs = getRemaining(METAS_DIARIAS.carboidratos, totalConsumed.carboidratos);
  const remainingFat = getRemaining(METAS_DIARIAS.gorduras, totalConsumed.gorduras);

  // --- HANDLERS ---
  const handleOpenModal = (mealName: string) => {
    setCurrentMealName(mealName);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddFood = (foodData: FoodData) => {
    setMeals(prevMeals => ({
      ...prevMeals,
      [currentMealName]: [...prevMeals[currentMealName], foodData]
    }));
    setExpandedMeal(currentMealName); 
  };
  
  const toggleMealExpansion = (mealName: string) => {
    if (expandedMeal === mealName) {
      setExpandedMeal(null);
    } else {
      setExpandedMeal(mealName);
    }
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    if (isDateToday(currentDate)) return;
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="page-container">
      {/* HEADER DE NAVEGAÇÃO */}
      <header className="page-header date-navigator">
        <button className="date-nav-btn" onClick={handlePreviousDay}>
          <LuChevronLeft size={24} />
        </button>
        <h2>{isDateToday(currentDate) ? 'Hoje' : formattedDate}</h2>
        <button 
          className="date-nav-btn" 
          onClick={handleNextDay}
          disabled={isDateToday(currentDate)}
        >
          <LuChevronRight size={24} />
        </button>
      </header>

      <div className="dieta-layout">
        
        {/* --- COLUNA DA ESQUERDA (RESUMO + WIDGETS) --- */}
        <div className="dieta-left-column">
          
          {/* Widget Resumo */}
          <div className="widget summary-widget">
            <h3 className="widget-title">Resumo do Dia</h3>
            
            <div className="calorie-circle">
              <span className="consumed-value">{Math.round(totalConsumed.calorias)}</span>
              <span className="goal-divider">/</span>
              <span className="goal-value">{METAS_DIARIAS.calorias} kcal</span>
            </div>

            <div className="remaining-macros">
              <div className="macro-item">
                <span className="macro-label">Proteínas (faltam)</span>
                <span className="macro-value protein">{Math.round(remainingProtein)}g</span>
              </div>
              <div className="macro-item">
                <span className="macro-label">Carboidratos (faltam)</span>
                <span className="macro-value carbs">{Math.round(remainingCarbs)}g</span>
              </div>
              <div className="macro-item">
                <span className="macro-label">Gorduras (faltam)</span>
                <span className="macro-value fat">{Math.round(remainingFat)}g</span>
              </div>
            </div>
          </div>

          {/* Widget de Água (NOVO) */}
          <HydrationWidget />

          {/* Gráfico Semanal (NOVO) */}
          <WeeklyDietChart dailyGoal={METAS_DIARIAS.calorias} />

        </div>

        {/* --- COLUNA DA DIREITA (REFEIÇÕES) --- */}
        <div className="dieta-right-column">
          <div className="widget">
            <h3 className="widget-title">Refeições do Dia</h3>
            <div className="meals-list">
              {REFEICOES_PADRAO.map(meal => {
                const isExpanded = expandedMeal === meal.name;
                const foodsInThisMeal = meals[meal.name] || [];

                return (
                  <div key={meal.id} className="meal-accordion">
                    <div className="meal-item-header" onClick={() => toggleMealExpansion(meal.name)}>
                      <div className="meal-header-left">
                        {isExpanded ? <LuChevronDown size={20} /> : <LuChevronRight size={20} />}
                        <span className="meal-name">{meal.name}</span>
                      </div>
                      <button 
                        className="btn-add-food" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(meal.name);
                        }}
                      >
                        <LuPlus size={16} /> Adicionar
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="meal-content-body">
                        {foodsInThisMeal.length === 0 ? (
                          <p className="no-food-item">Nenhum alimento registrado.</p>
                        ) : (
                          <ul className="food-list">
                            {foodsInThisMeal.map((food, index) => (
                              <li key={index} className="food-item">
                                <span className="food-item-name">{food.name}</span>
                                <span className="food-item-calories">{Math.round(food.calories)} kcal</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button className="btn-secondary">+ Nova Refeição</button>
          </div>
        </div>
      </div>

      {/* O MODAL */}
      <AddFoodModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddFood}
        mealName={currentMealName}
      />
    </div>
  );
}