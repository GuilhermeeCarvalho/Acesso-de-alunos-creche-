import { NavLink } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext.jsx';

export default function Sidebar() {
  const { usuario } = useAuth();

  const isAdmin = usuario?.role === 'ADMIN';

  const menuItems = [
    { to: '/home', label: 'Início' },
    { to: '/alunos/cadastro', label: 'Cadastro de aluno' },
    { to: '/alunos', label: 'Lista de alunos' },
    ...(isAdmin ? [{ to: '/funcionarios/cadastro', label: 'Cadastro de funcionário' }] : []),
    { to: '/registros/entrada-saida', label: 'Entrada e saída' },
    { to: '/registros/relatorio', label: 'Relatório' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <strong>Acesso da Creche</strong>
        <small>Gestão de alunos, profissionais e registros</small>
      </div>

      <nav className="sidebar__nav" aria-label="Menu lateral">
        {menuItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}