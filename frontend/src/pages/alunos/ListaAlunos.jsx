import { useEffect, useMemo, useState } from 'react';
import * as QRLib from 'qrcode.react';

const QRCodeComponent = QRLib.default ?? QRLib.QRCode ?? QRLib.QRCodeCanvas ?? QRLib.QRCodeSVG ?? QRLib;

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { listAlunos, updateAluno, deleteAluno } from '../../services/alunoService.js';
import { listResponsaveisDaCrianca, createResponsavel } from '../../services/responsavelService.js';
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

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState(fallbackAlunos);
  const [turmaFiltro, setTurmaFiltro] = useState('all');
  const [editingAluno, setEditingAluno] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [addingResponsavelFor, setAddingResponsavelFor] = useState(null);
  const [newResponsavel, setNewResponsavel] = useState({ nome: '', telefone: '', relacao: 'RESPONSAVEL_LEGAL' });
  const [selectedAlunoId, setSelectedAlunoId] = useState(null);
  const [qrAluno, setQrAluno] = useState(null);
  const [qrData, setQrData] = useState('');

  function buildQrPayload(aluno) {
    return JSON.stringify({ id: aluno.id, nome: aluno.nome, turma: aluno.turma });
  }

  function handleGenerateQr(aluno) {
    setQrAluno(aluno);
    setQrData(buildQrPayload(aluno));
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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
                        <td onClick={() => setSelectedAlunoId((prev) => (prev === aluno.id ? null : aluno.id))} style={{ cursor: 'pointer', userSelect: 'none' }} title="Clique para ver ações">
                          {aluno.nome}
                        </td>
                        <td>{aluno.turma}</td>
                        <td>
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

                  <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <QRCodeComponent value={qrData} size={220} includeMargin={true} renderAs="canvas" />
                  </div>

                  <div style={{ wordBreak: 'break-all', background: '#f7f7f7', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                    <strong>Dados do QR:</strong>
                    <pre style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>{qrData}</pre>
                  </div>

                  <div className="actions-row" style={{ marginTop: '12px', justifyContent: 'flex-end' }}>
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
          </section>
        </main>
      </div>
    </div>
  );
}
