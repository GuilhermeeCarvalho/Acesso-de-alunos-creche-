import React from 'react';

function Relatorio() {
  return (
    <div>
      <h1>Relatório de Entradas e Saídas</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Horário</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Exemplo</td>
            <td>08:00</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Relatorio;