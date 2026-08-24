import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext.jsx';
import { formatApiError } from '../../utils/errorFormatter.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from === '/login' ? '/home' : from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage('Preencha usuário e senha para continuar.');
      return;
    }

    try {
      await login(email, password);
      navigate(from === '/' || from === '/login' ? '/home' : from, { replace: true });
    } catch (error) {
      setMessage(formatApiError(error, 'Email ou senha inválidos. Verifique os dados e tente novamente.'));
    }
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
          <div style={{ position: 'relative' }}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
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

        <div className="actions-row">
          <button type="submit" className="button">
            Entrar
          </button>
        </div>

        <p className="muted" style={{ marginTop: '18px' }}>
          Primeiro acesso? Vá para a área de funcionários e cadastre um perfil.
        </p>

        {message && <div className="notice">{message}</div>}
      </form>
    </div>
  );
}
