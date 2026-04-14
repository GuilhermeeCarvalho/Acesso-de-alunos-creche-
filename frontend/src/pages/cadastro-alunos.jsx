import React, { useState } from 'react';
import axios from 'axios';

function CadastroAlunos() {
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ajustado para porta 8000 conforme seu Docker
      const response = await axios.post('http://localhost:8000/index.php', {
        nome,
        turma
      });
      setMessage('Criança cadastrada com sucesso!');
      setNome('');
      setTurma('');
    } catch (error) {
      setMessage('Erro ao cadastrar criança.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Cadastro de Alunos</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Turma:</label>
          <input
            type="text"
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
            required
          />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CadastroAlunos;