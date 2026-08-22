import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

function CadastroAlunos() {
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [creatingTurma, setCreatingTurma] = useState(false);
  const [novaTurma, setNovaTurma] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const turmaOptions = [
    'Berçário',
    'Maternal IA',
    'Maternal IB',
    'Maternal IIA',
    'Maternal IIB',
    'Maternal IIC',
    'Maternal IID',
    'Maternal IIE',
    'Maternal IIF',
    'PRÉ IA',
    'PRÉ IB',
    'PRÉ IC',
    'PRÉ IIA',
    'PRÉ IIB',
    'PRÉ IIC'
  ];
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const turmaFinal = creatingTurma ? novaTurma.trim() : turma;

      const response = await axios.post('http://localhost:8000/index.php', {
        nome,
        turma: turmaFinal
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
          <select
            value={creatingTurma ? '__create_new' : turma}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '__create_new') {
                setCreatingTurma(true);
                setTurma('');
              } else {
                setCreatingTurma(false);
                setTurma(val);
              }
            }}
            required
          >
            <option value="">Selecione a turma</option>
            {turmaOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
            {isAdmin && <option value="__create_new">Criar nova turma</option>}
          </select>

          {creatingTurma && isAdmin && (
            <input
              type="text"
              value={novaTurma}
              onChange={(e) => setNovaTurma(e.target.value)}
              placeholder="Nome da nova turma"
              required
              style={{ marginTop: '8px' }}
            />
          )}
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CadastroAlunos;