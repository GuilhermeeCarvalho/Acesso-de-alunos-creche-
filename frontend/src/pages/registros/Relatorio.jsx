import { useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';

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
    turno: registro.crianca?.turno || '',
    precisaPlantao: Boolean(registro.crianca?.precisaPlantao),
    responsavel: registro.responsavel?.nome || registro.responsavel || 'Sem responsável',
    funcionario: registro.funcionario?.nome || registro.funcionario || 'Sem funcionário',
    tipo: registro.tipo ? registro.tipo.replaceAll('_', ' ') : 'Sem tipo',
    observacao: registro.observacao || '—',
    dataHora: formatarDataHora(registro.dataHora),
    dataHoraOriginal: registro.dataHora,
    foraDoPadrao: false,
  };
}

function formatarResumoFiltro(valor) {
  if (!valor) {
    return 'Não informado';
  }

  return valor;
}

export default function Relatorio() {
  const [registros, setRegistros] = useState(() => fallbackRegistros.map(normalizarRegistro));
  const [alunos, setAlunos] = useState([]);
  const [turmaFiltro, setTurmaFiltro] = useState('all');
  const [turnoFiltro, setTurnoFiltro] = useState('all');
  const [alunoFiltro, setAlunoFiltro] = useState('all');
  const [filtroPlantao, setFiltroPlantao] = useState('all');
  const [filtroAtraso, setFiltroAtraso] = useState('all');
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

  const registrosComStatus = useMemo(() => {
    return registros.map((registro) => {
      const turno = registro.turno;
      const tipo = String(registro.tipo || '').toUpperCase();
      const dataHora = new Date(registro.dataHoraOriginal);

      if (!registro.precisaPlantao && turno && !Number.isNaN(dataHora.getTime())) {
        const hora = dataHora.getHours();
        const minuto = dataHora.getMinutes();
        const totalMinutos = hora * 60 + minuto;

        const intervalos = {
          Matutino: { inicio: 7 * 60 + 30, fim: 11 * 60 + 30 },
          Vespertino: { inicio: 13 * 60, fim: 17 * 60 },
        };

        const intervalo = intervalos[turno];

        if (intervalo) {
          const foraDoPadrao = totalMinutos < intervalo.inicio || totalMinutos > intervalo.fim;
          return { ...registro, foraDoPadrao };
        }
      }

      return { ...registro, foraDoPadrao: false };
    });
  }, [registros]);

  const turmasDisponiveis = useMemo(() => {
    return Array.from(
      new Set(registrosComStatus.map((registro) => registro.turma).filter(Boolean))
    ).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
    );
  }, [registrosComStatus]);

  const turnosDisponiveis = useMemo(() => {
    return Array.from(
      new Set(registrosComStatus.map((registro) => registro.turno).filter(Boolean))
    ).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
    );
  }, [registrosComStatus]);

  const alunosDisponiveis = useMemo(() => {
    const baseAlunos = Array.isArray(alunos) && alunos.length > 0
      ? alunos
      : Array.from(
          new Map(
            registrosComStatus
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
  }, [alunos, registrosComStatus, turmaFiltro]);

  useEffect(() => {
    setAlunoFiltro('all');
  }, [turmaFiltro]);

  const registrosFiltrados = useMemo(() => {
    return registrosComStatus.filter((registro) => {
      const passaTurma = turmaFiltro === 'all' || registro.turma === turmaFiltro;
      const passaTurno = turnoFiltro === 'all' || registro.turno === turnoFiltro;

      const alunoSelecionado = alunosDisponiveis.find(
        (aluno) => String(aluno.id) === String(alunoFiltro)
      );

      const passaAluno =
        alunoFiltro === 'all' ||
        (registro.criancaId
          ? String(registro.criancaId) === String(alunoFiltro)
          : registro.crianca === alunoSelecionado?.nome);

      const passaFiltroPlantao = filtroPlantao === 'all' || (filtroPlantao === 'sim' ? registro.precisaPlantao : !registro.precisaPlantao);
      const passaFiltroAtraso = filtroAtraso === 'all' || (filtroAtraso === 'sim' ? registro.foraDoPadrao : !registro.foraDoPadrao);

      const dataRegistro = formatarDataFiltro(registro.dataHoraOriginal);
      const passaDataInicial = !dataInicialFiltro || dataRegistro >= dataInicialFiltro;
      const passaDataFinal = !dataFinalFiltro || dataRegistro <= dataFinalFiltro;

      return passaTurma && passaTurno && passaAluno && passaFiltroPlantao && passaFiltroAtraso && passaDataInicial && passaDataFinal;
    });
  }, [registrosComStatus, turmaFiltro, turnoFiltro, alunoFiltro, alunosDisponiveis, filtroPlantao, filtroAtraso, dataInicialFiltro, dataFinalFiltro]);

  const resumoFiltros = useMemo(() => {
    const alunoSelecionado = alunosDisponiveis.find(
      (aluno) => String(aluno.id) === String(alunoFiltro)
    );

    return [
      turmaFiltro !== 'all' ? `Turma: ${turmaFiltro}` : null,
      turnoFiltro !== 'all' ? `Turno: ${turnoFiltro}` : null,
      alunoFiltro !== 'all' ? `Aluno: ${alunoSelecionado?.nome || 'Selecionado'}` : null,
      filtroPlantao !== 'all' ? `Plantão: ${filtroPlantao === 'sim' ? 'Sim' : 'Não'}` : null,
      filtroAtraso !== 'all' ? `Atraso: ${filtroAtraso === 'sim' ? 'Sim' : 'Não'}` : null,
      dataInicialFiltro ? `De: ${dataInicialFiltro}` : null,
      dataFinalFiltro ? `Até: ${dataFinalFiltro}` : null,
    ].filter(Boolean);
  }, [alunoFiltro, alunosDisponiveis, dataFinalFiltro, dataInicialFiltro, filtroAtraso, filtroPlantao, turmaFiltro, turnoFiltro]);

  const exportarPdf = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const colWidths = [30, 24, 24, 14, 34, 24, 18];
    const headerHeight = 8;
    const rowHeight = 9;
    const startX = margin;
    const totalWidth = colWidths.reduce((sum, value) => sum + value, 0);

    const formatValue = (value) => String(value ?? '').trim() || '—';

    const drawTextCell = (x, y, width, height, text, options = {}) => {
      const {
        fillColor = [255, 255, 255],
        textColor = [31, 41, 55],
        fontStyle = 'normal',
        fontSize = 6,
        borderColor = [226, 232, 240],
        align = 'left',
      } = options;

      doc.setFillColor(...fillColor);
      doc.rect(x, y, width, height, 'F');
      doc.setDrawColor(...borderColor);
      doc.rect(x, y, width, height);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', fontStyle);
      doc.setFontSize(fontSize);

      const wrappedText = doc.splitTextToSize(text, width - 2.5);
      const textY = y + 2.2 + (wrappedText.length - 1) * 1.6;
      doc.text(wrappedText, x + 1.2, textY, { align });
    };

    const drawHeader = (y) => {
      doc.setFillColor(37, 99, 235);
      doc.rect(startX, y, totalWidth, headerHeight + 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.2);

      let cursorX = startX;
      ['Criança', 'Responsável', 'Funcionário', 'Tipo', 'Observação', 'Data e hora', 'Status'].forEach((label, index) => {
        doc.text(label, cursorX + 1.2, y + 4.2);
        cursorX += colWidths[index];
      });
    };

    const drawTableRow = (row, y) => {
      const statusLabel = row.foraDoPadrao ? 'Com atraso' : 'Sem atraso';
      const statusTextColor = row.foraDoPadrao ? [190, 24, 93] : [22, 101, 52];
      const rowFill = row.foraDoPadrao ? [255, 241, 242] : [236, 253, 245];
      const values = [
        formatValue(row.crianca),
        formatValue(row.responsavel),
        formatValue(row.funcionario),
        formatValue(row.tipo),
        formatValue(row.observacao),
        formatValue(row.dataHora),
        statusLabel,
      ];

      const wrappedLines = values.map((value, index) => doc.splitTextToSize(value, colWidths[index] - 2.2));
      const maxLines = Math.max(...wrappedLines.map((lines) => lines.length));
      const currentRowHeight = Math.max(rowHeight, 3.8 + maxLines * 2.6);

      let cursorX = startX;
      values.forEach((value, index) => {
        const isStatusCell = index === values.length - 1;
        drawTextCell(cursorX, y, colWidths[index], currentRowHeight, value, {
          fillColor: isStatusCell ? [255, 255, 255] : rowFill,
          textColor: isStatusCell ? statusTextColor : [31, 41, 55],
          fontStyle: isStatusCell ? 'bold' : 'normal',
        });
        cursorX += colWidths[index];
      });

      return currentRowHeight;
    };

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(217, 231, 255);
    doc.roundedRect(8, 8, pageWidth - 16, 32, 2.5, 2.5, 'FD');
    doc.setFillColor(76, 110, 245);
    doc.roundedRect(10, 10, 4, 28, 1.5, 1.5, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Relatório de movimentações', 18, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Gerado em: ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())}`, 18, 26);

    doc.setFillColor(239, 245, 255);
    doc.setDrawColor(217, 231, 255);
    doc.roundedRect(10, 44, 58, 16, 2.2, 2.2, 'FD');
    doc.setTextColor(76, 110, 245);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Resumo', 16, 50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(String(registrosFiltrados.length), 16, 58);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(229, 236, 246);
    doc.roundedRect(72, 44, pageWidth - 84, 16, 2.2, 2.2, 'FD');
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('Filtros ativos', 78, 50);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const filtrosTexto = resumoFiltros.length > 0 ? resumoFiltros.join(' | ') : 'Nenhum filtro aplicado';
    doc.text(filtrosTexto, 78, 57);

    let currentY = 66;
    drawHeader(currentY);
    currentY += headerHeight + 3;

    registrosFiltrados.forEach((registro) => {
      if (currentY + rowHeight > pageHeight - 12) {
        doc.addPage();
        currentY = 14;
        drawHeader(currentY);
        currentY += headerHeight + 3;
      }

      currentY += drawTableRow(registro, currentY);
      currentY += 1.2;
    });

    if (registrosFiltrados.length === 0) {
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.text('Nenhum registro encontrado para os filtros selecionados.', 12, currentY + 8);
    }

    const nomeArquivo = `relatorio-movimentacoes-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.pdf`;
    doc.save(nomeArquivo);
  };

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
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
                marginBottom: '18px',
              }}
            >
              <label className="field" style={{ marginBottom: 0 }}>
                <span>Turma</span>
                <select value={turmaFiltro} onChange={(event) => setTurmaFiltro(event.target.value)}>
                  <option value="all">Todas</option>
                  {turmasDisponiveis.map((turma) => (
                    <option key={turma} value={turma}>
                      {turma}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field" style={{ marginBottom: 0 }}>
                <span>Turno</span>
                <select value={turnoFiltro} onChange={(event) => setTurnoFiltro(event.target.value)}>
                  <option value="all">Todos</option>
                  {turnosDisponiveis.map((turno) => (
                    <option key={turno} value={turno}>
                      {turno}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field" style={{ marginBottom: 0 }}>
                <span>Aluno</span>
                <select value={alunoFiltro} onChange={(event) => setAlunoFiltro(event.target.value)}>
                  <option value="all">Todos</option>
                  {alunosDisponiveis.map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field" style={{ marginBottom: 0 }}>
                <span>Plantão</span>
                <select value={filtroPlantao} onChange={(event) => setFiltroPlantao(event.target.value)}>
                  <option value="all">Todos</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </label>

              <label className="field" style={{ marginBottom: 0 }}>
                <span>Atraso</span>
                <select value={filtroAtraso} onChange={(event) => setFiltroAtraso(event.target.value)}>
                  <option value="all">Todos</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </label>

              <label className="field" style={{ marginBottom: 0 }}>
                <span>Data inicial</span>
                <input type="date" value={dataInicialFiltro} onChange={(event) => setDataInicialFiltro(event.target.value)} />
              </label>

              <label className="field" style={{ marginBottom: 0 }}>
                <span>Data final</span>
                <input type="date" value={dataFinalFiltro} onChange={(event) => setDataFinalFiltro(event.target.value)} />
              </label>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%)',
                  border: '1px solid #d9e7ff',
                  borderRadius: '16px',
                  padding: '16px 18px',
                  minWidth: '240px',
                  flex: 1,
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4c6ef5' }}>
                  Resumo
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937', marginTop: '6px' }}>
                  {registrosFiltrados.length}
                </div>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>
                  {registrosFiltrados.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                </div>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '16px 18px',
                  minWidth: '280px',
                  flex: 2,
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
                  Filtros ativos
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {resumoFiltros.length > 0 ? resumoFiltros.map((filtro) => (
                    <span key={filtro} style={{ background: '#e0ebff', color: '#3b5bdb', padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                      {filtro}
                    </span>
                  )) : (
                    <span style={{ color: '#6b7280', fontSize: '13px' }}>Nenhum filtro aplicado</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button type="button" className="button button--secondary" onClick={exportarPdf}>
                Baixar PDF
              </button>
            </div>

            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
              <Table
                columns={[
                  { key: 'crianca', label: 'Criança' },
                  { key: 'responsavel', label: 'Responsável' },
                  { key: 'funcionario', label: 'Funcionário' },
                  { key: 'tipo', label: 'Tipo' },
                  { key: 'observacao', label: 'Observação' },
                  { key: 'dataHora', label: 'Data e hora' },
                  {
                    key: 'foraDoPadrao',
                    label: 'Atraso',
                    render: (registro) => (
                      <span
                        style={{
                          color: registro.foraDoPadrao ? '#c53030' : '#2f855a',
                          fontWeight: 700,
                          background: registro.foraDoPadrao ? '#fff5f5' : '#f0fff4',
                          padding: '4px 8px',
                          borderRadius: '999px',
                          display: 'inline-block',
                        }}
                      >
                        {registro.foraDoPadrao ? 'Com atraso' : 'Sem atraso'}
                      </span>
                    ),
                  },
                ]}
                rows={registrosFiltrados}
                emptyMessage="Ainda não existem registros para exibir."
                getRowStyle={(registro) =>
                  registro.foraDoPadrao
                    ? {
                        backgroundColor: '#fff5f5',
                        boxShadow: 'inset 3px 0 0 #e53e3e',
                      }
                    : undefined
                }
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}