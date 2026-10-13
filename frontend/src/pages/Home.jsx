import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const horaAtual = new Date().getHours();
  const saudacao = horaAtual < 12 ? 'Bom dia' : horaAtual < 18 ? 'Boa tarde' : 'Boa noite';
  const nomeUsuario = user?.email?.split('@')[0] || 'bem-vindo(a)';
  const dataAtual = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <main className="page">
          <section className="home-dashboard">
            <article className="home-welcome">
              <div className="home-welcome__content">
                <p className="home-dashboard__label">Acesso da Creche</p>
                <h1>{saudacao},<br />{nomeUsuario}!</h1>
                <p className="home-dashboard__description">
                  Gestão escolar simples e organizada para acompanhar o dia a dia da creche.
                </p>
                <div className="home-welcome__details">
                  <span className="home-welcome__date">{dataAtual}</span>
                  <span className="home-dashboard__role">
                    {isAdmin ? 'Administrador' : 'Funcionário'}
                  </span>
                </div>
              </div>
              <div className="home-welcome__visual">
                <div className="home-welcome__orbit home-welcome__orbit--outer" />
                <div className="home-welcome__orbit home-welcome__orbit--inner" />
                <img
                  className="home-welcome__logo"
                  src="/images/logo-creche.png"
                  alt="Logo da CEIM Neide de Fátima Lobemayer"
                />
                <span className="home-welcome__spark home-welcome__spark--one" />
                <span className="home-welcome__spark home-welcome__spark--two" />
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
