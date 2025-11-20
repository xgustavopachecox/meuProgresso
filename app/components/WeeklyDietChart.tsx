import React from 'react';
import './WeeklyDietChart.css'; // Vamos criar em seguida

const MOCK_WEEK_DATA = [
  { day: 'Dom', kcal: 2800 },
  { day: 'Seg', kcal: 3100 },
  { day: 'Ter', kcal: 3250 }, // Passou um pouco
  { day: 'Qua', kcal: 3000 },
  { day: 'Qui', kcal: 1200 }, // Dia atual (incompleto)
  { day: 'Sex', kcal: 0 },
  { day: 'Sab', kcal: 0 },
];

interface Props {
  dailyGoal: number;
}

const WeeklyDietChart: React.FC<Props> = ({ dailyGoal }) => {
  // Calcula a altura da barra com base na meta (meta = 100% da altura de referência)
  const getHeight = (val: number) => {
    const percentage = (val / dailyGoal) * 100;
    // Limitamos a 150% pra não estourar o layout visualmente
    return Math.min(percentage, 150); 
  };

  return (
    <div className="weekly-chart-container">
      <div className="chart-header">
        <h4>Semana Atual</h4>
        <span>Meta: {dailyGoal} kcal</span>
      </div>
      
      <div className="chart-bars-area">
        {/* Linha pontilhada da meta */}
        <div className="goal-line" style={{ bottom: '60%' }} title="Meta Diária"></div>

        {MOCK_WEEK_DATA.map((data, index) => {
            // Se passou de 110% da meta, fica "laranja/vermelho" (alerta)
            const isOver = data.kcal > dailyGoal * 1.1;
            // Altura da barra (escala visual, ajustada para a linha da meta ficar em ~60% da altura total)
            const barHeight = (data.kcal / dailyGoal) * 60; 
            
            return (
              <div key={index} className="chart-column">
                <div className="bar-wrapper">
                  <div 
                    className={`chart-bar ${isOver ? 'over' : ''}`}
                    style={{ height: `${barHeight}%` }}
                  ></div>
                </div>
                <span className="day-label">{data.day}</span>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default WeeklyDietChart;