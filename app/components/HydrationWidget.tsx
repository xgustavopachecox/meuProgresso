import React from 'react';
import { LuGlassWater, LuMinus } from 'react-icons/lu';
import './HydrationWidget.css';

// Agora ele recebe dados via props
interface Props {
  currentAmount: number;
  onAdd: (amount: number) => void;
}

const GOAL = 3000; // Meta fixa de 3L

export default function HydrationWidget({ currentAmount, onAdd }: Props) {
  const percentage = Math.min((currentAmount / GOAL) * 100, 100);

  return (
    <div className="hydration-widget">
      <div className="hydration-header">
        <div className="hydration-title">
          <LuGlassWater size={20} className="water-icon" />
          <h3>Hidratação</h3>
        </div>
        <span className="hydration-value">{currentAmount}ml <span className="goal">/ {GOAL}ml</span></span>
      </div>

      <div className="water-bar-container">
        <div className="water-bar" style={{ width: `${percentage}%` }}></div>
      </div>

      <div className="hydration-actions">
        <button className="btn-water remove" onClick={() => onAdd(-250)}><LuMinus size={16}/></button>
        <button className="btn-water add" onClick={() => onAdd(250)}>+ 250ml</button>
        <button className="btn-water add" onClick={() => onAdd(500)}>+ 500ml</button>
      </div>
    </div>
  );
}