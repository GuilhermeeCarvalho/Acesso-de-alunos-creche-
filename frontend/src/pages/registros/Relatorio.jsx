import { useEffect, useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Table from '../../components/Table.jsx';
import { listRegistros } from '../../services/registroService.js';

const fallbackRegistros = [
  { id: 1, nome: 'Ana Clara', tipo: 'Entrada', horario: '07:45' },
  { id: 2, nome: 'Miguel Santos', tipo: 'Saída', horario: '17:10' },
];

export default function Relatorio() {
  const [registros, setRegistros] = useState(fallbackRegistros);

  useEffect(() => {
    let isActive = true;

    async function loadRegistros() {
      try {
        const data = await listRegistros();

        if (isActive && Array.isArray(data) && data.length > 0) {
          setRegistros(data);
        }
      } catch {
        if (isActive) {
          setRegistros(fallbackRegistros);
        }
      }
    }

    loadRegistros();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <main className="page">
          <Header
            eyebrow="Relatórios"
            title="Relatório de movimentações"
            description="Acompanhe as entradas e saídas registradas no sistema com uma visualização limpa."
          />

          <section className="panel" style={{ marginTop: '22px' }}>
            <Table
              columns={[
                { key: 'nome', label: 'Nome' },
                { key: 'tipo', label: 'Tipo' },
                { key: 'horario', label: 'Horário' },
              ]}
              rows={registros}
              emptyMessage="Ainda não existem registros para exibir."
            />
          </section>
        </main>
      </div>
    </div>
  );
}