// 1. A correção principal: garantir que o import vem de 'react-router-dom'
import { NavLink } from 'react-router-dom';

// 2. O import do CSS agora está correto para a sua estrutura
import './Sidebar.css'; 
import { 
  LuLayoutDashboard, 
  LuDumbbell, 
  LuClipboardCheck, 
  LuBookOpenCheck,
  LuCode,
  LuChurch
} from 'react-icons/lu';

export default function Sidebar() {
  // O resto do código continua exatamente o mesmo
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">MeuProgresso</h1>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/home">
              <LuLayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          {/* ...outros links... */}
          <li>
            <NavLink to="/treino">
              <LuDumbbell size={20} />
              <span>Treino</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dieta">
              <LuClipboardCheck size={20} />
              <span>Dieta</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/concurso">
              <LuBookOpenCheck size={20} />
              <span>Concurso</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/programacao">
              <LuCode size={20} />
              <span>Programação</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/espiritual">
              <LuChurch size={20} />
              <span>Espiritual</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}