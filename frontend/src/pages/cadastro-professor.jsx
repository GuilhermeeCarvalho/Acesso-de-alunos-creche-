import React from 'react';
import { Link } from 'react-router-dom';

function CadastroProfessor() {
  return (
    <div>
      <h1>Cadastro de Professores</h1>
      <form>
        <input type="text" placeholder="Nome do Professor" />
        <button type="submit">Salvar</button>
      </form>
      <Link to="/login">
        <button type="button">Login</button>
      </Link>
    </div>
  );
}

export default CadastroProfessor;