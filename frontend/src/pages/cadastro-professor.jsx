import React from 'react';

function CadastroProfessor() {
  return (
    <div>
      <h1>Cadastro de Professores</h1>
      <form>
        <input type="text" placeholder="Nome do Professor" />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default CadastroProfessor;