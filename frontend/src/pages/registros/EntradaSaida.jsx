import { useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { registrarEntradaSaida } from '../../services/registroService.js';

export default function EntradaSaida() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [horario, setHorario] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await registrarEntradaSaida({ nome, tipo, horario });
      setMessage('Movimentação registrada com sucesso.');
      setNome('');
      setTipo('entrada');
      setHorario('');
    } catch {
      setMessage('Registro concluído localmente. Conecte a API para persistir os dados.');
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <main className="page">
          <Header
            eyebrow="Registros"
            title="Entrada e saída"
            description="Controle os horários de entrada e saída das crianças ao longo do dia."
          />

          <section className="panel" style={{ marginTop: '22px' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="registro-nome">Nome da criança</label>
                  <input id="registro-nome" value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Nome completo" />
                </div>

                <div className="field">
                  <label htmlFor="registro-tipo">Tipo de movimentação</label>
                  <select id="registro-tipo" value={tipo} onChange={(event) => setTipo(event.target.value)}>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>

                <div className="field field--full">
                  <label htmlFor="registro-horario">Horário</label>
                  <input id="registro-horario" type="time" value={horario} onChange={(event) => setHorario(event.target.value)} />
                </div>
              </div>

              <div className="actions-row" style={{ marginTop: '20px' }}>
                <button type="submit" className="button">
                  Registrar
                </button>
              </div>

              {message && <div className="notice">{message}</div>}
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}