import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div>
      <h1>Página Inicial - Creche</h1>
      <p>Bem-vindo ao sistema de gestão.</p>
      <nav>
        <ul>
          <li><Link to="/cadastro-professor">Cadastro de Professores</Link></li>
          <li><Link to="/cadastro-alunos">Cadastro de Alunos</Link></li>
          <li><Link to="/relatorio">Relatório</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;