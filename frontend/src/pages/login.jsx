import React from 'react';
import { Link } from 'react-router-dom';
import './login.css';

function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Bem-vindo</h1>
          <p>Faça login para acessar o controle de acesso dos funcionários.</p>
        </div>
        <div className="login-form">
          <label htmlFor="login-user">Usuário</label>
          <input id="login-user" type="text" placeholder="Digite seu usuário" />

          <label htmlFor="login-password">Senha</label>
          <input id="login-password" type="password" placeholder="Digite sua senha" />

          <button className="login-button">Entrar</button>

          <div className="login-footer">
            <span>Não possui conta?</span>
            <Link to="/cadastro-professor" className="signup-link">
              Cadastre-se aqui
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;