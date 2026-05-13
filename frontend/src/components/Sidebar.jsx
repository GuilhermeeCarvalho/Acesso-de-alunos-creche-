import { NavLink } from 'react-router-dom';

const menuItems = [
  { to: '/', label: 'Início' },
  { to: '/alunos/cadastro', label: 'Cadastro de aluno' },
  { to: '/alunos', label: 'Lista de alunos' },
  { to: '/funcionarios/cadastro', label: 'Cadastro de funcionário' },
  { to: '/registros/entrada-saida', label: 'Entrada e saída' },
  { to: '/registros/relatorio', label: 'Relatório' },
  { to: '/login', label: 'Login' },
];

export default function Sidebar() {
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