import { useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { createFuncionario } from '../../services/funcionarioService.js';

const roleOptions = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'FUNCIONARIO', label: 'FUNCIONARIO' },
];

export default function CadastroFuncionario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('FUNCIONARIO');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();
    const senhaLimpa = senha.trim();

    if (!nomeLimpo || !emailLimpo || !senhaLimpa || !role) {
      setError('Informe nome, e-mail, senha e role para continuar.');
      setMessage('');
      return;
    }

    try {
      await createFuncionario({
        nome: nomeLimpo,
        email: emailLimpo,
        senha: senhaLimpa,
        role,
      });

      setMessage('Funcionário cadastrado com sucesso.');
      setError('');
      setNome('');
      setEmail('');
      setSenha('');
      setRole('FUNCIONARIO');
    } catch (err) {
      const apiMessage = err?.response?.data?.message || err?.response?.data?.mensagem;
      setError(apiMessage || 'Não foi possível cadastrar o funcionário. Verifique a API e tente novamente.');
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
            eyebrow="Funcionários"
            title="Cadastro de funcionário"
            description="Registre professores e colaboradores com nome, e-mail, senha e role do backend."
          />

          <section className="panel" style={{ marginTop: '22px' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="funcionario-nome">Nome completo</label>
                  <input
                    id="funcionario-nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="funcionario-email">E-mail</label>
                  <input
                    id="funcionario-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nome@creche.com"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="funcionario-senha">Senha</label>
                  <input
                    id="funcionario-senha"
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="Digite uma senha"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="funcionario-role">Role</label>
                  <select id="funcionario-role" value={role} onChange={(event) => setRole(event.target.value)} required>
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="actions-row" style={{ marginTop: '20px' }}>
                <button type="submit" className="button">
                  Salvar funcionário
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