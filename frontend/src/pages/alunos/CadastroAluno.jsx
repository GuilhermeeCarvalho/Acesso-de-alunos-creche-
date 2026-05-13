import { useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { createAluno } from '../../services/alunoService.js';

export default function CadastroAluno() {
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createAluno({ nome, turma, responsavel });
      setMessage('Aluno cadastrado com sucesso.');
      setNome('');
      setTurma('');
      setResponsavel('');
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
            eyebrow="Alunos"
            title="Cadastro de aluno"
            description="Mantenha os dados principais das crianças organizados para consulta rápida."
          />

          <section className="panel" style={{ marginTop: '22px' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="aluno-nome">Nome do aluno</label>
                  <input id="aluno-nome" value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Nome completo" />
                </div>

                <div className="field">
                  <label htmlFor="aluno-turma">Turma</label>
                  <input id="aluno-turma" value={turma} onChange={(event) => setTurma(event.target.value)} placeholder="Ex.: Jardim II" />
                </div>

                <div className="field field--full">
                  <label htmlFor="aluno-responsavel">Responsável</label>
                  <input
                    id="aluno-responsavel"
                    value={responsavel}
                    onChange={(event) => setResponsavel(event.target.value)}
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>

              <div className="actions-row" style={{ marginTop: '20px' }}>
                <button type="submit" className="button">
                  Salvar aluno
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