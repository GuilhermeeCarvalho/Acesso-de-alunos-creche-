import { useEffect, useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Table from '../../components/Table.jsx';
import { listRegistros } from '../../services/registroService.js';

const fallbackRegistros = [
  {
    id: 1,
    crianca: 'Ana Clara',
    responsavel: 'Marina Souza',
    funcionario: 'Júlia Lima',
    tipo: 'ENTRADA',
    dataHora: '2026-05-23T07:45:00',
  },
  {
    id: 2,
    crianca: 'Miguel Santos',
    responsavel: 'Carlos Santos',
    funcionario: 'Júlia Lima',
    tipo: 'SAIDA',
    dataHora: '2026-05-23T17:10:00',
  },
];

function formatarDataHora(dataHora) {
  if (!dataHora) {
    return 'Não informado';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(dataHora));
}

function normalizarRegistro(registro) {
  return {
    id: registro.id,
    crianca: registro.crianca?.nome || registro.crianca || 'Sem criança',
    responsavel: registro.responsavel?.nome || registro.responsavel || 'Sem responsável',
    funcionario: registro.funcionario?.nome || registro.funcionario || 'Sem funcionário',
    tipo: registro.tipo ? registro.tipo.replaceAll('_', ' ') : 'Sem tipo',
    dataHora: formatarDataHora(registro.dataHora),
  };
}

export default function Relatorio() {
  const [registros, setRegistros] = useState(fallbackRegistros);

  useEffect(() => {
    let isActive = true;

    async function loadRegistros() {
      try {
        const data = await listRegistros();

        if (isActive && Array.isArray(data) && data.length > 0) {
          setRegistros(data.map(normalizarRegistro));
        }
      } catch {
        if (isActive) {
          setRegistros(fallbackRegistros.map(normalizarRegistro));
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
                { key: 'crianca', label: 'Criança' },
                { key: 'responsavel', label: 'Responsável' },
                { key: 'funcionario', label: 'Funcionário' },
                { key: 'tipo', label: 'Tipo' },
                { key: 'dataHora', label: 'Data e hora' },
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