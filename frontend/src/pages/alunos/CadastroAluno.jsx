import { useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { createAluno } from '../../services/alunoService.js';

export default function CadastroAluno() {
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nomeLimpo = nome.trim();
    const turmaLimpa = turma.trim();

    if (!nomeLimpo || !turmaLimpa) {
      setError('Informe o nome do aluno e a turma para continuar.');
      setMessage('');
      return;
    }

    try {
      await createAluno({ nome: nomeLimpo, turma: turmaLimpa });
      setMessage('Aluno cadastrado com sucesso.');
      setError('');
      setNome('');
      setTurma('');
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      setError(apiMessage || 'Não foi possível cadastrar o aluno. Verifique a API e tente novamente.');
      setMessage('');
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
                  <input
                    id="aluno-nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="aluno-turma">Turma</label>
                  <input
                    id="aluno-turma"
                    value={turma}
                    onChange={(event) => setTurma(event.target.value)}
                    placeholder="Ex.: Jardim II"
                    required
                  />
                </div>
              </div>

              <div className="actions-row" style={{ marginTop: '20px' }}>
                <button type="submit" className="button">
                  Salvar aluno
                </button>
              </div>

              {error && <div className="notice notice--error">{error}</div>}
              {message && <div className="notice">{message}</div>}
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}