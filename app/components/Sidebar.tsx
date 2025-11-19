import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { 
  LuChevronLeft,
  LuChevronRight,
  LuLayoutDashboard, 
  LuDumbbell, 
  LuUtensils, // Usei Utensils para dieta (mais comum)
  LuBookOpenCheck, // Concurso
  LuTerminal, // Mudei para Terminal para programação (mais tech)
  LuZap, // Usei um raio para a Logo
  LuWallet, // Financeiro
  LuFlower2 // Espiritual
} from 'react-icons/lu';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* --- NOVA LOGO --- */}
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <LuZap size={24} />
          </div>
          {isOpen && (
            <div className="logo-text">
              <span className="logo-title">MEU</span>
              <span className="logo-subtitle">PROGRESSO</span>
            </div>
          )}
        </div>
      </div>

      <button className="sidebar-toggle" onClick={onToggle}>
        {isOpen ? <LuChevronLeft size={18} /> : <LuChevronRight size={18} />}
      </button>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/home">
              <LuLayoutDashboard size={22} />
              {isOpen && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/treino">
              <LuDumbbell size={22} />
              {isOpen && <span>Treino</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/dieta">
              <LuUtensils size={22} />
              {isOpen && <span>Dieta</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/financeiro">
              <LuWallet size={22} />
              {isOpen && <span>Financeiro</span>}
            </NavLink>
          </li>
          
          <li className="divider"></li> {/* Divisor visual */}

          <li>
            <NavLink to="/concurso">
              <LuBookOpenCheck size={22} />
              {isOpen && <span>Concurso</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/programacao">
              <LuTerminal size={22} />
              {isOpen && <span>Programação</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/espiritual">
              <LuFlower2 size={22} />
              {isOpen && <span>Espiritual</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}