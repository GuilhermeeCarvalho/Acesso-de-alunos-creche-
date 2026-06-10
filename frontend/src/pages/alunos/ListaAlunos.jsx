import { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { jsPDF } from 'jspdf';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { listAlunos, updateAluno, deleteAluno } from '../../services/alunoService.js';
import { listResponsaveisDaCrianca, createResponsavel, updateResponsavel, deleteResponsavel, deleteVinculo } from '../../services/responsavelService.js';
import { createVinculo } from '../../services/vinculoService.js';

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

function formatRelacao(relacao) {
  return relacao ? relacao.replaceAll('_', ' ') : 'Sem relação';
}

function MenuDotsIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="3" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="8" cy="13" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState(fallbackAlunos);
  const [turmaFiltro, setTurmaFiltro] = useState('all');
  const [editingAluno, setEditingAluno] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [addingResponsavelFor, setAddingResponsavelFor] = useState(null);
  const [newResponsavel, setNewResponsavel] = useState({ nome: '', telefone: '', relacao: 'RESPONSAVEL_LEGAL' });
  const [selectedAlunoId, setSelectedAlunoId] = useState(null);
  const [selectedResponsavelId, setSelectedResponsavelId] = useState(null);
  const [editingResponsavel, setEditingResponsavel] = useState(null);
  const [showEditResponsavel, setShowEditResponsavel] = useState(false);
  const [qrAluno, setQrAluno] = useState(null);
  const [qrData, setQrData] = useState('');
  const qrCanvasWrapperRef = useRef(null);

  function buildQrPayload(aluno) {
    return JSON.stringify({ id: aluno.id, nome: aluno.nome, turma: aluno.turma });
  }

  function handleGenerateQr(aluno) {
    setQrAluno(aluno);
    setQrData(buildQrPayload(aluno));
  }

  function downloadQrPdf() {
    if (!qrAluno) {
      return;
    }

    const canvas = qrCanvasWrapperRef.current?.querySelector('canvas');

    if (!canvas) {
      alert('Não foi possível gerar o PDF do QR Code.');
      return;
    }

    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginX = 16;
    const topY = 20;
    const columnGap = 12;
    const qrSize = 72;
    const leftColumnWidth = pageWidth - (marginX * 2) - columnGap - qrSize;
    const rightColumnX = pageWidth - marginX - qrSize;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('QR Code do aluno', marginX, topY);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    const textLines = [
      `Nome: ${qrAluno.nome || 'Não informado'}`,
      `Turma: ${qrAluno.turma || 'Não informada'}`,
    ];

    const wrappedLines = textLines.flatMap((line) => pdf.splitTextToSize(line, leftColumnWidth));
    pdf.text(wrappedLines, marginX, topY + 14);

    const qrImage = canvas.toDataURL('image/png');
    const qrImageY = topY + 4;
    pdf.addImage(qrImage, 'PNG', rightColumnX, qrImageY, qrSize, qrSize);

    pdf.setDrawColor(220, 220, 220);
    pdf.line(pageWidth / 2, topY, pageWidth / 2, pageHeight - topY);

    pdf.save(`qr-code-${String(qrAluno.nome || 'aluno').replaceAll(' ', '-').toLowerCase()}.pdf`);
  }

  function handleCloseQr() {
    setQrAluno(null);
    setQrData('');
  }

  async function refreshAlunos() {
    try {
      const data = await listAlunos();

      if (Array.isArray(data)) {
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
        return;
      }

      setAlunos(fallbackAlunos);
    } catch {
      setAlunos(fallbackAlunos);
    }
  }

  useEffect(() => {
    refreshAlunos();
  }, []);

  async function handleDeleteAluno(alunoId) {
    if (!window.confirm('Confirma exclusão do aluno e todos os vínculos?')) return;

    try {
      await deleteAluno(alunoId);
      await refreshAlunos();
    } catch (err) {
      
      console.error(err);
      alert('Não foi possível excluir o aluno. Verifique a API.');
    }
  }

  function handleStartEdit(aluno) {
    setEditingAluno({ id: aluno.id, nome: aluno.nome || '', turma: aluno.turma || '' });
    setShowEdit(true);
  }

  async function handleSaveEdit() {
    try {
      await updateAluno(editingAluno.id, { nome: editingAluno.nome, turma: editingAluno.turma });
      setShowEdit(false);
      setEditingAluno(null);
      await refreshAlunos();
    } catch (err) {
     
      console.error(err);
      alert('Não foi possível atualizar o aluno. Verifique a API.');
    }
  }

  function handleStartAddResponsavel(aluno) {
    setAddingResponsavelFor(aluno.id);
    setNewResponsavel({ nome: '', telefone: '', relacao: 'RESPONSAVEL_LEGAL' });
  }

  async function handleAddResponsavel() {
    if (!newResponsavel.nome || !newResponsavel.telefone) {
      alert('Informe nome e telefone do responsável.');
      return;
    }

    try {
      const criado = await createResponsavel({ nome: newResponsavel.nome, telefone: newResponsavel.telefone });
      await createVinculo({ criancaId: addingResponsavelFor, responsavelId: criado.id, relacao: newResponsavel.relacao });
      setAddingResponsavelFor(null);
      setNewResponsavel({ nome: '', telefone: '', relacao: 'RESPONSAVEL_LEGAL' });
      await refreshAlunos();
    } catch (err) {
      
      console.error(err);
      alert('Não foi possível adicionar o responsável. Verifique a API.');
    }
  }

  const turmasDisponiveis = useMemo(() => {
    return Array.from(new Set(alunos.map((aluno) => aluno.turma).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
    );
  }, [alunos]);

  const alunosFiltrados = useMemo(() => {
    const alunosOrdenados = [...alunos].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));

    if (turmaFiltro === 'all') {
      return alunosOrdenados;
    }

    return alunosOrdenados.filter((aluno) => aluno.turma === turmaFiltro);
  }, [alunos, turmaFiltro]);

  function toggleAlunoActions(alunoId) {
    setSelectedAlunoId((prev) => (prev === alunoId ? null : alunoId));
  }

  function toggleResponsavelActions(alunoId, responsavelId) {
    const chave = `${alunoId}-${responsavelId}`;
    setSelectedResponsavelId((prev) => (prev === chave ? null : chave));
  }

  function handleStartEditResponsavel(responsavel, alunoId) {
    setEditingResponsavel({ ...responsavel, alunoId });
    setShowEditResponsavel(true);
    setSelectedResponsavelId(null);
  }

  async function handleSaveEditResponsavel() {
    if (!editingResponsavel.nome || !editingResponsavel.telefone) {
      alert('Informe nome e telefone do responsável.');
      return;
    }

    try {
      await updateResponsavel(editingResponsavel.id || editingResponsavel.responsavelId, {
        nome: editingResponsavel.nome,
        telefone: editingResponsavel.telefone,
      });
     
      setShowEditResponsavel(false);
      setEditingResponsavel(null);
      await refreshAlunos();
    } catch (err) {
     
      console.error(err);
      alert('Não foi possível atualizar o responsável. Verifique a API.');
    }
  }

  async function handleDeleteResponsavel(alunoId, responsavelId) {
    if (!window.confirm('Confirma exclusão deste responsável?')) return;

    try {
      await deleteVinculo(alunoId, responsavelId);
      setSelectedResponsavelId(null);
      await refreshAlunos();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert('Não foi possível excluir o responsável. Verifique a API.');
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <main className="page">
          <Header eyebrow="Alunos" title="Lista de alunos" description="Consulta rápida das crianças cadastradas e de suas turmas." />

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

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Turma</th>
                    <th>Responsáveis</th>
                  </tr>
                </thead>

                <tbody>
                  {alunosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={3} className="empty-state">
                        Nenhum aluno cadastrado.
                      </td>
                    </tr>
                  )}

                  {alunosFiltrados.map((aluno) => (
                    <>
                      <tr key={aluno.id}>
                        <td onClick={() => toggleAlunoActions(aluno.id)} style={{ cursor: 'pointer', userSelect: 'none' }} title="Clique para abrir o menu de opções">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                            <span>{aluno.nome}</span>

                            <button
                              type="button"
                              className="row-menu-trigger"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleAlunoActions(aluno.id);
                              }}
                              aria-label={`Abrir menu de opções de ${aluno.nome}`}
                              aria-expanded={selectedAlunoId === aluno.id}
                              title="Abrir menu de opções"
                            >
                              <MenuDotsIcon />
                              <span>Opções</span>
                            </button>
                          </div>
                        </td>
                        <td>{aluno.turma}</td>
                        <td>
                          <div className="responsible-cards">
                            {(aluno.responsaveis?.length ? aluno.responsaveis : []).map((responsavel, index) => {
                              const responsavelId = responsavel.responsavelId ?? responsavel.id;
                              const chave = `${aluno.id}-${responsavelId}`;
                              const isOpen = selectedResponsavelId === chave;

                              return (
                                <div key={chave}>
                                  <div className="responsible-card">
                                    <div className="responsible-card__header">
                                      <strong>{responsavel.nome}</strong>
                                      <span className="responsible-card__badge">{formatRelacao(responsavel.relacao)}</span>
                                    </div>

                                    <div className="responsible-card__meta">Telefone: {responsavel.telefone || 'Não informado'}</div>

                                    <button
                                      type="button"
                                      className="row-menu-trigger"
                                      onClick={() => toggleResponsavelActions(aluno.id, responsavelId)}
                                      aria-label={`Abrir menu de opções de ${responsavel.nome}`}
                                      aria-expanded={isOpen}
                                      title="Abrir menu de opções"
                                      style={{ marginTop: '8px', alignSelf: 'flex-start' }}
                                    >
                                      <MenuDotsIcon />
                                      <span>Opções</span>
                                    </button>

                                    {isOpen && (
                                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <button
                                          type="button"
                                          className="button button--small"
                                          onClick={() => handleStartEditResponsavel(responsavel, aluno.id)}
                                        >
                                          Editar
                                        </button>
                                        <button
                                          type="button"
                                          className="button button--danger button--small"
                                          onClick={() => handleDeleteResponsavel(aluno.id, responsavelId)}
                                        >
                                          Remover
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            {!aluno.responsaveis?.length && <div className="responsible-card responsible-card--empty">Sem vínculo</div>}
                          </div>
                        </td>
                      </tr>

                      {selectedAlunoId === aluno.id && (
                        <tr key={`${aluno.id}-actions`}>
                          <td colSpan={3} style={{ padding: '12px 16px', background: '#fafafa' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button type="button" className="button button--small" onClick={() => handleStartEdit(aluno)}>
                                Editar
                              </button>
                              <button type="button" className="button button--danger button--small" onClick={() => handleDeleteAluno(aluno.id)}>
                                Excluir
                              </button>
                              <button type="button" className="button button--secondary button--small" onClick={() => handleStartAddResponsavel(aluno)}>
                                Adicionar responsável
                              </button>
                              <button type="button" className="button button--secondary button--small" onClick={() => handleGenerateQr(aluno)}>
                                Gerar QR
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {qrAluno && (
              <div
                className="modal"
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}
              >
                <div className="modal__content" style={{ background: '#fff', padding: '20px', borderRadius: '6px', width: '460px', maxWidth: '96%' }}>
                  <h3>QR Code de {qrAluno.nome}</h3>
                  <p>Escaneie este QR para identificar o aluno no registro de entrada/saída.</p>

                  <div ref={qrCanvasWrapperRef} style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <QRCodeCanvas value={qrData} size={220} includeMargin={true} />
                  </div>

                  <div style={{ wordBreak: 'break-all', background: '#f7f7f7', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                    <strong>Dados do QR:</strong>
                    <pre style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>{qrData}</pre>
                  </div>

                  <div className="actions-row" style={{ marginTop: '12px', justifyContent: 'flex-end' }}>
                    <button type="button" className="button" onClick={downloadQrPdf}>
                      Baixar PDF
                    </button>
                    <button type="button" className="button button--secondary" onClick={handleCloseQr}>
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showEdit && editingAluno && (
              <div
                className="modal"
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}
              >
                <div className="modal__content" style={{ background: '#fff', padding: '20px', borderRadius: '6px', width: '480px', maxWidth: '96%' }}>
                  <h3>Editar aluno</h3>
                  <div className="form-grid">
                    <div className="field">
                      <label>Nome</label>
                      <input value={editingAluno.nome} onChange={(e) => setEditingAluno({ ...editingAluno, nome: e.target.value })} />
                    </div>

                    <div className="field">
                      <label>Turma</label>
                      <input value={editingAluno.turma} onChange={(e) => setEditingAluno({ ...editingAluno, turma: e.target.value })} />
                    </div>
                  </div>

                  <div className="actions-row" style={{ marginTop: '12px' }}>
                    <button type="button" className="button" onClick={handleSaveEdit}>
                      Salvar
                    </button>
                    <button type="button" className="button button--secondary" onClick={() => { setShowEdit(false); setEditingAluno(null); }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {addingResponsavelFor && (
              <div
                className="modal"
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}
              >
                <div className="modal__content" style={{ background: '#fff', padding: '20px', borderRadius: '6px', width: '480px', maxWidth: '96%' }}>
                  <h3>Adicionar responsável</h3>

                  <div className="form-grid">
                    <div className="field">
                      <label>Nome</label>
                      <input value={newResponsavel.nome} onChange={(e) => setNewResponsavel({ ...newResponsavel, nome: e.target.value })} />
                    </div>

                    <div className="field">
                      <label>Telefone</label>
                      <input value={newResponsavel.telefone} onChange={(e) => setNewResponsavel({ ...newResponsavel, telefone: e.target.value })} />
                    </div>

                    <div className="field field--full">
                      <label>Relação</label>
                      <select value={newResponsavel.relacao} onChange={(e) => setNewResponsavel({ ...newResponsavel, relacao: e.target.value })}>
                        <option value="PAI">PAI</option>
                        <option value="MAE">MAE</option>
                        <option value="IRMAO">IRMAO</option>
                        <option value="TIO">TIO</option>
                        <option value="AVO">AVO</option>
                        <option value="RESPONSAVEL_LEGAL">RESPONSAVEL LEGAL</option>
                      </select>
                    </div>
                  </div>

                  <div className="actions-row" style={{ marginTop: '12px' }}>
                    <button type="button" className="button" onClick={handleAddResponsavel}>
                      Adicionar
                    </button>
                    <button type="button" className="button button--secondary" onClick={() => setAddingResponsavelFor(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showEditResponsavel && editingResponsavel && (
              <div
                className="modal"
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}
              >
                <div className="modal__content" style={{ background: '#fff', padding: '20px', borderRadius: '6px', width: '480px', maxWidth: '96%' }}>
                  <h3>Editar responsável</h3>

                  <div className="form-grid">
                    <div className="field">
                      <label>Nome</label>
                      <input value={editingResponsavel.nome} onChange={(e) => setEditingResponsavel({ ...editingResponsavel, nome: e.target.value })} />
                    </div>

                    <div className="field">
                      <label>Telefone</label>
                      <input value={editingResponsavel.telefone} onChange={(e) => setEditingResponsavel({ ...editingResponsavel, telefone: e.target.value })} />
                    </div>

                    <div className="field field--full">
                      <label>Relação</label>
                      <select value={editingResponsavel.relacao || 'RESPONSAVEL_LEGAL'} onChange={(e) => setEditingResponsavel({ ...editingResponsavel, relacao: e.target.value })}>
                        <option value="PAI">PAI</option>
                        <option value="MAE">MAE</option>
                        <option value="IRMAO">IRMAO</option>
                        <option value="TIO">TIO</option>
                        <option value="AVO">AVO</option>
                        <option value="RESPONSAVEL_LEGAL">RESPONSAVEL LEGAL</option>
                      </select>
                    </div>
                  </div>

                  <div className="actions-row" style={{ marginTop: '12px' }}>
                    <button type="button" className="button" onClick={handleSaveEditResponsavel}>
                      Salvar
                    </button>
                    <button type="button" className="button button--secondary" onClick={() => { setShowEditResponsavel(false); setEditingResponsavel(null); }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
