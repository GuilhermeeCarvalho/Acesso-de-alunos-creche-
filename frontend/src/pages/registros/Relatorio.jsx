import { useEffect, useMemo, useState } from 'react';

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
    turma: registro.crianca?.turma || 'Sem turma',
    responsavel: registro.responsavel?.nome || registro.responsavel || 'Sem responsável',
    funcionario: registro.funcionario?.nome || registro.funcionario || 'Sem funcionário',
    tipo: registro.tipo ? registro.tipo.replaceAll('_', ' ') : 'Sem tipo',
    dataHora: formatarDataHora(registro.dataHora),
  };
}

export default function Relatorio() {
  const [registros, setRegistros] = useState(fallbackRegistros);
  const [turmaFiltro, setTurmaFiltro] = useState('all');

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

  const turmasDisponiveis = useMemo(() => {
    return Array.from(
      new Set(registros.map((registro) => registro.turma).filter(Boolean))
    ).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
    );
  }, [registros]);

  const registrosFiltrados = useMemo(() => {
    if (turmaFiltro === 'all') {
      return registros;
    }

    return registros.filter(
      (registro) => registro.turma === turmaFiltro
    );
  }, [registros, turmaFiltro]);

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
            <div className="table-toolbar">
              <label className="field">
                <span>Filtrar por turma</span>

                <select
                  value={turmaFiltro}
                  onChange={(event) => setTurmaFiltro(event.target.value)}
                >
                  <option value="all">Todas as turmas</option>

                  {turmasDisponiveis.map((turma) => (
                    <option key={turma} value={turma}>
                      {turma}
                    </option>
                  ))}
                </select>
              </label>

              <div className="table-toolbar__summary">
                <strong>{registrosFiltrados.length}</strong>
                <span>
                  {registrosFiltrados.length === 1
                    ? ' registro exibido'
                    : ' registros exibidos'}
                </span>
              </div>
            </div>

            <Table
              columns={[
                { key: 'crianca', label: 'Criança' },
                { key: 'responsavel', label: 'Responsável' },
                { key: 'funcionario', label: 'Funcionário' },
                { key: 'tipo', label: 'Tipo' },
                { key: 'dataHora', label: 'Data e hora' },
              ]}
              rows={registrosFiltrados}
              emptyMessage="Ainda não existem registros para exibir."
            />
          </section>
        </main>
      </div>
    </div>
  );
}