import { Link } from 'react-router-dom';

import Header from '../components/Header.jsx';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const cards = [
  { title: 'Cadastro de alunos', description: 'Registre novas crianças e acompanhe as turmas.', to: '/alunos/cadastro', span: 'card--span-4' },
  { title: 'Lista de alunos', description: 'Veja a base atual com filtros e ações futuras.', to: '/alunos', span: 'card--span-4' },
  { title: 'Entrada e saída', description: 'Registre horários com precisão e rastreabilidade.', to: '/registros/entrada-saida', span: 'card--span-4' },
  { title: 'Funcionários', description: 'Gerencie os profissionais vinculados à creche.', to: '/funcionarios/cadastro', span: 'card--span-6' },
  { title: 'Relatórios', description: 'Acesse um resumo dos lançamentos feitos no sistema.', to: '/registros/relatorio', span: 'card--span-6' },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <main className="page">
          <Header
            eyebrow="Painel da Creche"
            title={isAuthenticated ? `Olá, ${user?.name}` : 'Acesso de alunos da creche'}
            description="Organize cadastros, acompanhe entradas e saídas e consulte relatórios em um só lugar."
            actions={
              <>
                <Link className="button" to="/alunos/cadastro">
                  Novo aluno
                </Link>
                <Link className="button-secondary" to="/registros/entrada-saida">
                  Registrar movimentação
                </Link>
              </>
            }
          />

          <section className="dashboard-grid">
            {cards.map((card) => (
              <article key={card.title} className={`card ${card.span}`}>
                <span className="eyebrow">Acesso rápido</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className="actions-row" style={{ marginTop: '18px' }}>
                  <Link className="button-ghost" to={card.to}>
                    Abrir módulo
                  </Link>
                </div>
              </article>
            ))}

            <article className="panel card--span-12">
              <h3>Visão geral</h3>
              <p>
                Esta estrutura separa a área de autenticação, alunos, funcionários, registros, contexto de acesso e camada de serviços.
              </p>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
