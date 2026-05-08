import React from 'react';
import { Link } from 'react-router-dom';
import './cadastro-professor.css';

function CadastroProfessor() {
  return (
    <div className="cadastro-prof-page">
      <div className="cadastro-prof-card">
        <div className="cadastro-prof-header">
          <h1>Cadastro de Professores</h1>
          <p>Preencha os campos abaixo para criar sua conta</p>
        </div>
        <div className="cadastro-prof-form">
          <label htmlFor="cadastro-prof-user">Usuário</label>
          <input id="cadastro-prof-user" type="text" placeholder="Digite seu usuário" />
    
          <label htmlFor="cadastro-prof-password">Senha</label>
          <input id="cadastro-prof-password" type="password" placeholder="Digite sua senha" />
    
          <button className="cadastro-prof-button">Cadastrar</button>

          <div className="cadastro-prof-footer">
            <span>Já possui conta?</span>
            <Link to="/login" className="signup-link">
              Faça login aqui
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CadastroProfessor;