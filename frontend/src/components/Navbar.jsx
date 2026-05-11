import { NavLink } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.jsx';

const navigationItems = [
  { to: '/', label: 'Home' },
  { to: '/alunos', label: 'Alunos' },
  { to: '/funcionarios/cadastro', label: 'Funcionários' },
  { to: '/registros/relatorio', label: 'Registros' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <nav className="navbar__links" aria-label="Navegação principal">
        {navigationItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar__user">
        <span className="status-pill">{isAuthenticated ? user?.name : 'Acesso livre'}</span>
        {isAuthenticated && (
          <button type="button" className="button-ghost" onClick={logout}>
            Sair
          </button>
        )}
      </div>
    </header>
  );
}