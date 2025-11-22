import { useState, useMemo, useEffect } from 'react';
import './dieta.css';
// IMPORTANDO O NOVO MODAL E O TIPO FoodData
import AddFoodModal, { type FoodData } from '../components/AddFoodModal';
import DietPlanModal from '../components/DietPlanModal'; 

import { 
  LuPlus, LuChevronDown, LuChevronRight, LuChevronLeft, LuCalendar, 
  LuCheck, LuArrowLeft, LuX, LuTrophy, LuClipboardList // Novo ícone
} from 'react-icons/lu';
import HydrationWidget from '../components/HydrationWidget';

// --- TIPOS ---
interface MealsState {
  [mealName: string]: FoodData[];
}

interface DailySummary {
  day: string;
  date: string;
  calories: number;
  status: 'success' | 'fail';
}

interface WeeklyLog {
  id: number;
  label: string;
  status: string;
  compliance: string;
  days: DailySummary[];
}

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

const MOCK_MEALS_TODAY: MealsState = { "Café da Manhã": [], "Almoço": [], "Lanche da Tarde": [], "Janta": [] };
const MOCK_MEALS_YESTERDAY: MealsState = {
  "Café da Manhã": [{ name: "Ovos (3)", calories: 210, protein: 18, carbs: 1, fat: 15 }],
  "Almoço": [{ name: "Frango (200g)", calories: 330, protein: 62, carbs: 0, fat: 7 }],
  "Lanche da Tarde": [], "Janta": []
};

const MOCK_WEEKLY_DETAILS: WeeklyLog[] = [
  { 
    id: 1, 
    label: 'Semana Atual', 
    status: 'Em andamento', 
    compliance: '2/3 dias na meta',
    days: [
      { day: 'Segunda', date: '18/11', calories: 3200, status: 'success' },
      { day: 'Terça', date: '19/11', calories: 3150, status: 'success' },
      { day: 'Quarta', date: '20/11', calories: 1200, status: 'fail' },
    ]
  },
  { 
    id: 2, 
    label: 'Semana Passada', 
    status: 'Concluída', 
    compliance: '6/7 dias na meta',
    days: [
      { day: 'Segunda', date: '11/11', calories: 3205, status: 'success' },
      { day: 'Terça', date: '12/11', calories: 3180, status: 'success' },
      { day: 'Quarta', date: '13/11', calories: 2900, status: 'fail' },
      { day: 'Quinta', date: '14/11', calories: 3210, status: 'success' },
      { day: 'Sexta', date: '15/11', calories: 3300, status: 'success' },
      { day: 'Sábado', date: '16/11', calories: 3200, status: 'success' },
      { day: 'Domingo', date: '17/11', calories: 3150, status: 'success' },
    ]
  },
];

const isDateToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export default function DietaPage() {
  const [viewMode, setViewMode] = useState<'DAILY' | 'WEEK_DETAIL'>('DAILY');
  const [selectedWeek, setSelectedWeek] = useState<WeeklyLog | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState<MealsState>(MOCK_MEALS_TODAY);
  const [waterLog, setWaterLog] = useState<Record<string, number>>({});

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false); // <--- NOVO ESTADO
  
  const [currentMealName, setCurrentMealName] = useState('');
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  const dateKey = currentDate.toDateString();

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (dateKey === today.toDateString()) setMeals(MOCK_MEALS_TODAY);
    else if (dateKey === yesterday.toDateString()) setMeals(MOCK_MEALS_YESTERDAY);
    else setMeals(MOCK_MEALS_TODAY);

    setWaterLog(prev => {
      if (prev[dateKey] !== undefined) return prev;
      return { ...prev, [dateKey]: dateKey === yesterday.toDateString() ? 2500 : 0 };
    });
    setExpandedMeal(null); 
  }, [dateKey]);

  const totalConsumed = useMemo(() => {
    let totals = { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 };
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

  const getRemaining = (goal: number, consumed: number) => Math.max(0, goal - consumed);
  const remainingProtein = getRemaining(METAS_DIARIAS.proteinas, totalConsumed.proteinas);
  const remainingCarbs = getRemaining(METAS_DIARIAS.carboidratos, totalConsumed.carboidratos);
  const remainingFat = getRemaining(METAS_DIARIAS.gorduras, totalConsumed.gorduras);

  const openWeekDetails = (weekId: number) => {
    const week = MOCK_WEEKLY_DETAILS.find(w => w.id === weekId);
    if (week) { setSelectedWeek(week); setViewMode('WEEK_DETAIL'); }
  };
  const goBack = () => { setViewMode('DAILY'); setSelectedWeek(null); };
  const handleAddWater = (amount: number) => { setWaterLog(prev => ({ ...prev, [dateKey]: Math.max(0, (prev[dateKey] || 0) + amount) })); };
  
  const handleAddFood = (foodData: FoodData) => {
    setMeals(prev => ({ ...prev, [currentMealName]: [...prev[currentMealName], foodData] }));
    setExpandedMeal(currentMealName);
  };

  const handleOpenModal = (name: string) => { setCurrentMealName(name); setIsModalOpen(true); };
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleMealExpansion = (name: string) => setExpandedMeal(expandedMeal === name ? null : name);
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    if (days > 0 && isDateToday(currentDate)) return;
    setCurrentDate(newDate);
  };
  const formattedDate = currentDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

  // --- TELA SEMANAL ---
  if (viewMode === 'WEEK_DETAIL' && selectedWeek) {
    const totalWeekCalories = selectedWeek.days.reduce((acc, day) => acc + day.calories, 0);
    const totalWeekGoal = METAS_DIARIAS.calorias * selectedWeek.days.length;
    const weeklyAverage = Math.round(totalWeekCalories / selectedWeek.days.length);
    return (
      <div className="page-container">
        <header className="page-header session-header">
          <button className="btn-back" onClick={goBack}><LuArrowLeft size={24} /></button>
          <div><h1>{selectedWeek.label}</h1><p>{selectedWeek.status} • {selectedWeek.compliance}</p></div>
        </header>
        <div className="week-detail-content">
          <div className="widget">
            <h3 className="widget-title"><LuTrophy size={18}/> Desempenho Diário</h3>
            <div className="days-list">
              {selectedWeek.days.map((day, index) => (
                <div key={index} className="day-row">
                  <div className="day-info"><span className="day-name">{day.day}</span><span className="day-date">{day.date}</span></div>
                  <div className="day-stats"><span className="day-kcal">{day.calories} kcal</span><div className={`status-icon ${day.status}`}>{day.status === 'success' ? <LuCheck size={20}/> : <LuX size={20}/>}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="widget">
             <h3 className="widget-title">Média Semanal</h3>
             <div className="weekly-averages">
                <div className="avg-item"><span>Média Diária</span><strong>{weeklyAverage} kcal</strong></div>
                <div className="avg-item"><span>Total Calorias</span><strong style={{ fontSize: '1rem' }}>{totalWeekCalories} / {totalWeekGoal}</strong></div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA DIÁRIA ---
  return (
    <div className="page-container">
      <header className="page-header date-navigator">
        <button className="date-nav-btn" onClick={() => changeDate(-1)}><LuChevronLeft size={24} /></button>
        <h2>{isDateToday(currentDate) ? 'Hoje' : formattedDate}</h2>
        <button className="date-nav-btn" onClick={() => changeDate(1)} disabled={isDateToday(currentDate)}><LuChevronRight size={24} /></button>
      </header>

      <div className="dieta-layout">
        
        {/* ESQUERDA */}
        <div className="dieta-left-column">
          <div className="widget summary-widget area-resumo">
            <h3 className="widget-title">Resumo do Dia</h3>
            <div className="calorie-circle">
              <span className="consumed-value">{Math.round(totalConsumed.calorias)}</span>
              <span className="goal-divider">/</span>
              <span className="goal-value">{METAS_DIARIAS.calorias} kcal</span>
            </div>
            <div className="remaining-macros">
              <div className="macro-item"><span className="macro-label">Proteínas</span><span className="macro-value protein">{Math.round(remainingProtein)}g</span></div>
              <div className="macro-item"><span className="macro-label">Carboidratos</span><span className="macro-value carbs">{Math.round(remainingCarbs)}g</span></div>
              <div className="macro-item"><span className="macro-label">Gorduras</span><span className="macro-value fat">{Math.round(remainingFat)}g</span></div>
            </div>
          </div>

          <div className="widget diet-history-widget area-historico">
            <h3 className="widget-title">Histórico Semanal</h3>
            <div className="weeks-list-diet">
              {MOCK_WEEKLY_DETAILS.map(week => (
                <div key={week.id} className="week-card-diet" onClick={() => openWeekDetails(week.id)}>
                  <div className="week-header-diet"><LuCalendar size={18} /><span>{week.label}</span></div>
                  <div className="week-body-diet">
                    <span className={`status-badge ${week.status === 'Em andamento' ? 'active' : ''}`}>{week.status}</span>
                    <div className="compliance-tag"><LuCheck size={14} /> {week.compliance}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DIREITA */}
        <div className="dieta-right-column">
          <div className="widget area-refeicoes">
            
            {/* HEADER CUSTOMIZADO COM O BOTÃO */}
            <div className="widget-header-actions">
              <h3 className="widget-title-clean">Refeições</h3>
              <button className="btn-view-plan" onClick={() => setIsPlanModalOpen(true)}>
                <LuClipboardList size={16} /> Ver Dieta
              </button>
            </div>

            <div className="meals-list">
              {REFEICOES_PADRAO.map(meal => {
                const isExpanded = expandedMeal === meal.name;
                const foods = meals[meal.name] || [];
                const mealCals = foods.reduce((acc, f) => acc + f.calories, 0);
                return (
                  <div key={meal.id} className="meal-accordion">
                    <div className="meal-item-header" onClick={() => toggleMealExpansion(meal.name)}>
                      <div className="meal-header-left">
                        {isExpanded ? <LuChevronDown size={20} /> : <LuChevronRight size={20} />}
                        <div className="meal-info-header"><span className="meal-name">{meal.name}</span><span className="meal-cal-total">{Math.round(mealCals)} kcal</span></div>
                      </div>
                      <button className="btn-add-food" onClick={(e) => { e.stopPropagation(); handleOpenModal(meal.name); }}><LuPlus size={16} /></button>
                    </div>
                    {isExpanded && (
                      <div className="meal-content-body">
                        {foods.length === 0 ? <p className="no-food-item">Vazio</p> : (
                          <ul className="food-list">
                            {foods.map((f, i) => (
                              <li key={i} className="food-item"><span className="food-item-name">{f.name}</span><span className="food-item-calories">{Math.round(f.calories)}</span></li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="area-agua">
             <HydrationWidget currentAmount={waterLog[dateKey] || 0} onAdd={handleAddWater} />
          </div>
        </div>
      </div>

      {/* MODAIS */}
      <AddFoodModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleAddFood} mealName={currentMealName} />
      
      <DietPlanModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} />
    </div>
  );
}