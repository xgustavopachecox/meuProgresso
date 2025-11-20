import React, { useState } from 'react';
import { LuGlassWater, LuPlus, LuMinus } from 'react-icons/lu';
import './HydrationWidget.css'; // Vamos criar

export default function HydrationWidget() {
  const [waterMl, setWaterMl] = useState(1250); // Começa com um pouco bebido
  const GOAL = 3000; // Meta 3 litros

  const percentage = Math.min((waterMl / GOAL) * 100, 100);

  const addWater = (amount: number) => {
    setWaterMl(prev => Math.max(0, prev + amount));
  };

  return (
    <div className="hydration-widget">
      <div className="hydration-header">
        <div className="hydration-title">
          <LuGlassWater size={20} className="water-icon" />
          <h3>Hidratação</h3>
        </div>
        <span className="hydration-value">{waterMl}ml <span className="goal">/ {GOAL}ml</span></span>
      </div>

      {/* Barra de Progresso Azul */}
      <div className="water-bar-container">
        <div className="water-bar" style={{ width: `${percentage}%` }}></div>
      </div>

      <div className="hydration-actions">
        <button className="btn-water remove" onClick={() => addWater(-250)}><LuMinus size={16}/></button>
        <button className="btn-water add" onClick={() => addWater(250)}>+ 250ml</button>
        <button className="btn-water add" onClick={() => addWater(500)}>+ 500ml</button>
      </div>
    </div>
  );
}