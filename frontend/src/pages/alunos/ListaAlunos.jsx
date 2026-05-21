import { useEffect, useMemo, useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Table from '../../components/Table.jsx';
import { listAlunos } from '../../services/alunoService.js';
import { listResponsaveisDaCrianca } from '../../services/responsavelService.js';

const fallbackAlunos = [
  {
    id: 1,
    nome: 'Ana Clara',
    turma: 'Jardim II',
    responsaveis: [
      { nome: 'Marina Souza', telefone: '(47) 99999-9999', relacao: 'MAE' },
    ],
  },
  {
    id: 2,
    nome: 'Miguel Santos',
    turma: 'Maternal I',
    responsaveis: [
      { nome: 'Carlos Santos', telefone: '(47) 98888-8888', relacao: 'PAI' },
      { nome: 'Lucia Santos', telefone: '(47) 97777-7777', relacao: 'MAE' },
    ],
  },
];

function formatResponsaveis(responsaveis = []) {
  if (!responsaveis.length) {
    return 'Sem vínculo';
  }

  return responsaveis
    .map((responsavel) => {
      const relacao = responsavel.relacao ? ` (${responsavel.relacao.replaceAll('_', ' ')})` : '';
      const telefone = responsavel.telefone ? ` - ${responsavel.telefone}` : '';

      return `${responsavel.nome}${relacao}${telefone}`;
    })
    .join('\n');
}

function formatRelacao(relacao) {
  return relacao ? relacao.replaceAll('_', ' ') : 'Sem relação';
}

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState(fallbackAlunos);
  const [turmaFiltro, setTurmaFiltro] = useState('all');

  useEffect(() => {
    let isActive = true;

    async function loadAlunos() {
      try {
        const data = await listAlunos();

        if (isActive && Array.isArray(data) && data.length > 0) {
          const alunosComResponsaveis = await Promise.all(
            data.map(async (aluno) => {
              try {
                const responsaveis = await listResponsaveisDaCrianca(aluno.id);

                return {
                  ...aluno,
                  responsaveis: Array.isArray(responsaveis) ? responsaveis : [],
                };
              } catch {
                return {
                  ...aluno,
                  responsaveis: [],
                };
              }
            })
          );

          setAlunos(alunosComResponsaveis);
        }
      } catch {
        if (isActive) {
          setAlunos(fallbackAlunos);
        }
      }
    }

    loadAlunos();

    return () => {
      isActive = false;
    };
  }, []);

  const turmasDisponiveis = useMemo(() => {
    return Array.from(new Set(alunos.map((aluno) => aluno.turma).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
    );
  }, [alunos]);

  const alunosFiltrados = useMemo(() => {
    const alunosOrdenados = [...alunos].sort((a, b) =>
      a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
    );

    if (turmaFiltro === 'all') {
      return alunosOrdenados;
    }

    return alunosOrdenados.filter((aluno) => aluno.turma === turmaFiltro);
  }, [alunos, turmaFiltro]);

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <main className="page">
          <Header
            eyebrow="Alunos"
            title="Lista de alunos"
            description="Consulta rápida das crianças cadastradas e de suas turmas."
          />

          <section className="panel" style={{ marginTop: '22px' }}>
            <div className="table-toolbar">
              <label className="field" htmlFor="filtro-turma">
                <span>Filtrar por turma</span>
                <select id="filtro-turma" value={turmaFiltro} onChange={(event) => setTurmaFiltro(event.target.value)}>
                  <option value="all">Todas as turmas</option>
                  {turmasDisponiveis.map((turma) => (
                    <option key={turma} value={turma}>
                      {turma}
                    </option>
                  ))}
                </select>
              </label>

              <div className="table-toolbar__summary">
                <strong>{alunosFiltrados.length}</strong>
                <span>{alunosFiltrados.length === 1 ? 'aluno exibido' : 'alunos exibidos'}</span>
              </div>
            </div>

            <Table
              columns={[
                { key: 'nome', label: 'Nome' },
                { key: 'turma', label: 'Turma' },
                {
                  key: 'responsaveis',
                  label: 'Responsáveis',
                  render: (aluno) => (
                    <div className="responsible-cards">
                      {(aluno.responsaveis?.length ? aluno.responsaveis : []).map((responsavel, index) => (
                        <div key={`${aluno.id}-${responsavel.responsavelId ?? responsavel.id ?? index}`} className="responsible-card">
                          <div className="responsible-card__header">
                            <strong>{responsavel.nome}</strong>
                            <span className="responsible-card__badge">{formatRelacao(responsavel.relacao)}</span>
                          </div>

                          <div className="responsible-card__meta">Telefone: {responsavel.telefone || 'Não informado'}</div>
                        </div>
                      ))}

                      {!aluno.responsaveis?.length && <div className="responsible-card responsible-card--empty">Sem vínculo</div>}
                    </div>
                  ),
                },
              ]}
              rows={alunosFiltrados}
              emptyMessage="Nenhum aluno cadastrado."
            />
          </section>
        </main>
      </div>
    </div>
  );
}