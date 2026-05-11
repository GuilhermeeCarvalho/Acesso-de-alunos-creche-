import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage('Preencha usuário e senha para continuar.');
      return;
    }

    await login({ email, name: email.split('@')[0] || 'Usuário' });
    setMessage('Acesso liberado.');
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Área restrita</span>
        <h1>Entrar no sistema</h1>
        <p>Use seu usuário para acessar os módulos administrativos da creche.</p>

        <div className="field">
          <label htmlFor="login-email">Usuário ou e-mail</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@creche.com"
          />
        </div>

        <div className="field">
          <label htmlFor="login-password">Senha</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Digite sua senha"
          />
        </div>

        <div className="actions-row">
          <button type="submit" className="button">
            Entrar
          </button>
          <Link to="/" className="button-secondary">
            Voltar para home
          </Link>
        </div>

        <p className="muted" style={{ marginTop: '18px' }}>
          Primeiro acesso? Vá para a área de funcionários e cadastre um perfil.
        </p>

        {message && <div className="notice">{message}</div>}
      </form>
    </div>
  );
}