import { useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { createFuncionario } from '../../services/funcionarioService.js';
import { formatApiError } from '../../utils/errorFormatter.js';

const roleOptions = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'FUNCIONARIO', label: 'FUNCIONARIO' },
];

export default function CadastroFuncionario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

    if (!emailLimpo.toLowerCase().endsWith('@creche.com')) {
      setError('O e-mail precisa terminar com @creche.com.');
      setMessage('');
      return;
    }

    if (senhaLimpa.length < 6) {
      setError('A senha precisa ter pelo menos 6 dígitos.');
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
      setError(formatApiError(err, 'Não foi possível cadastrar o funcionário. Verifique os dados e tente novamente.'));
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
                  <div style={{ position: 'relative' }}>
                    <input
                      id="funcionario-senha"
                      type={showPassword ? 'text' : 'password'}
                      value={senha}
                      onChange={(event) => setSenha(event.target.value)}
                      placeholder="Digite uma senha"
                      required
                      style={{ paddingRight: '42px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'transparent',
                        color: '#4c6ef5',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '12px',
                      }}
                    >
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
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