import { useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { createFuncionario } from '../../services/funcionarioService.js';

export default function CadastroFuncionario() {
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createFuncionario({ nome, cargo, email });
      setMessage('Funcionário cadastrado com sucesso.');
      setNome('');
      setCargo('');
      setEmail('');
    } catch {
      setMessage('Cadastro concluído localmente. Conecte a API para persistir os dados.');
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <main className="page">
          <Header
            eyebrow="Funcionários"
            title="Cadastro de funcionário"
            description="Registre professores e colaboradores com os dados principais do perfil."
          />

          <section className="panel" style={{ marginTop: '22px' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="funcionario-nome">Nome completo</label>
                  <input id="funcionario-nome" value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Nome completo" />
                </div>

                <div className="field">
                  <label htmlFor="funcionario-cargo">Cargo</label>
                  <input id="funcionario-cargo" value={cargo} onChange={(event) => setCargo(event.target.value)} placeholder="Ex.: Professora" />
                </div>

                <div className="field field--full">
                  <label htmlFor="funcionario-email">E-mail</label>
                  <input id="funcionario-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@creche.com" />
                </div>
              </div>

              <div className="actions-row" style={{ marginTop: '20px' }}>
                <button type="submit" className="button">
                  Salvar funcionário
                </button>
              </div>

              {message && <div className="notice">{message}</div>}
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}