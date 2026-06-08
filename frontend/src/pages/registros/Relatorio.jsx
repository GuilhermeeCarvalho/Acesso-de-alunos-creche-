import { useEffect, useMemo, useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Table from '../../components/Table.jsx';
import { listAlunos } from '../../services/alunoService.js';
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

function formatarDataFiltro(dataHora) {
  if (!dataHora) {
    return '';
  }

  const data = new Date(dataHora);
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function normalizarRegistro(registro) {

  return {
    id: registro.id,
    criancaId: registro.crianca?.id ?? null,
    crianca: registro.crianca?.nome || registro.crianca || 'Sem criança',
    turma: registro.crianca?.turma || 'Sem turma',
    responsavel: registro.responsavel?.nome || registro.responsavel || 'Sem responsável',
    funcionario: registro.funcionario?.nome || registro.funcionario || 'Sem funcionário',
    tipo: registro.tipo ? registro.tipo.replaceAll('_', ' ') : 'Sem tipo',
    dataHora: formatarDataHora(registro.dataHora),
    dataHoraOriginal: registro.dataHora,
  };
}

export default function Relatorio() {
  const [registros, setRegistros] = useState(() => fallbackRegistros.map(normalizarRegistro));
  const [alunos, setAlunos] = useState([]);
  const [turmaFiltro, setTurmaFiltro] = useState('all');
  const [alunoFiltro, setAlunoFiltro] = useState('all');
  const [dataInicialFiltro, setDataInicialFiltro] = useState('');
  const [dataFinalFiltro, setDataFinalFiltro] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadAlunos() {
      try {
        const data = await listAlunos();

        if (isActive && Array.isArray(data)) {
          setAlunos(data);
        }
      } catch {
        if (isActive) {
          setAlunos([]);
        }
      }
    }

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

    loadAlunos();
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

  const alunosDisponiveis = useMemo(() => {
    const baseAlunos = Array.isArray(alunos) && alunos.length > 0
      ? alunos
      : Array.from(
          new Map(
            registros
              .filter((registro) => registro.crianca)
              .map((registro, index) => [
                `${registro.criancaId || registro.crianca}-${registro.turma || index}`,
                {
                  id: registro.criancaId || registro.crianca,
                  nome: registro.crianca,
                  turma: registro.turma,
                },
              ])
          ).values()
        );

    return baseAlunos
      .filter((aluno) => turmaFiltro === 'all' || aluno.turma === turmaFiltro)
      .sort((a, b) =>
        String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR', {
          sensitivity: 'base',
        })
      );
  }, [alunos, registros, turmaFiltro]);

  useEffect(() => {
    setAlunoFiltro('all');
  }, [turmaFiltro]);

  const registrosFiltrados = useMemo(() => {
    return registros.filter((registro) => {
      const passaTurma =
        turmaFiltro === 'all' || registro.turma === turmaFiltro;

      const alunoSelecionado = alunosDisponiveis.find(
        (aluno) => String(aluno.id) === String(alunoFiltro)
      );

      const passaAluno =
        alunoFiltro === 'all' ||
        (registro.criancaId
          ? String(registro.criancaId) === String(alunoFiltro)
          : registro.crianca === alunoSelecionado?.nome);

      const dataRegistro = formatarDataFiltro(registro.dataHoraOriginal);
      const passaDataInicial = !dataInicialFiltro || dataRegistro >= dataInicialFiltro;
      const passaDataFinal = !dataFinalFiltro || dataRegistro <= dataFinalFiltro;

      return passaTurma && passaAluno && passaDataInicial && passaDataFinal;
    });
  }, [registros, turmaFiltro, alunoFiltro, alunosDisponiveis, dataInicialFiltro, dataFinalFiltro]);

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
            <div
              className="table-toolbar"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <label className="field">
                  <span>Filtrar por turma</span>

                  <select
                    value={turmaFiltro}
                    onChange={(event) =>
                      setTurmaFiltro(event.target.value)
                    }
                  >
                    <option value="all">Todas as turmas</option>

                    {turmasDisponiveis.map((turma) => (
                      <option key={turma} value={turma}>
                        {turma}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Filtrar por aluno</span>

                  <select
                    value={alunoFiltro}
                    onChange={(event) =>
                      setAlunoFiltro(event.target.value)
                    }
                    disabled={turmaFiltro === 'all'}
                  >
                    <option value="all">
                      {turmaFiltro === 'all' ? 'Selecione uma turma primeiro' : 'Todos os alunos'}
                    </option>

                    {alunosDisponiveis.map((aluno) => (
                      <option key={aluno.id} value={aluno.id}>
                        {aluno.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>Data inicial</span>

                  <input
                    type="date"
                    value={dataInicialFiltro}
                    onChange={(event) => setDataInicialFiltro(event.target.value)}
                  />
                </label>

                <label className="field">
                  <span>Data final</span>

                  <input
                    type="date"
                    value={dataFinalFiltro}
                    onChange={(event) => setDataFinalFiltro(event.target.value)}
                  />
                </label>
              </div>

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