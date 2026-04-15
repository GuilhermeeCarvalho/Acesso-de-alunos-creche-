import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <input type="text" placeholder="Usuário" />
      <input type="password" placeholder="Senha" />
      <button>Entrar</button>
      <div style={{ marginTop: '16px' }}>
        <Link to="/cadastro-professor">
          <button type="button">Caso não tenha conta, cadastre-se</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;