import { useEffect, useMemo, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { listAlunos } from '../../services/alunoService.js';
import { listResponsaveisDaCrianca } from '../../services/responsavelService.js';
import { registrarMovimentacao } from '../../services/registroService.js';
import { formatApiError } from '../../utils/errorFormatter.js';

function formatarDataHora(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date);
}

function formatarRelacao(relacao) {
  return relacao ? relacao.replaceAll('_', ' ') : 'Sem relação';
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M9 4.5 7.7 6.2H5.5A2.5 2.5 0 0 0 3 8.7v7A2.5 2.5 0 0 0 5.5 18.2h13A2.5 2.5 0 0 0 21 15.7v-7a2.5 2.5 0 0 0-2.5-2.5h-2.2L15 4.5H9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export default function EntradaSaida() {
  const { usuario } = useAuth();
  const [alunos, setAlunos] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [criancaId, setCriancaId] = useState('');
  const [responsavelId, setResponsavelId] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [observacao, setObservacao] = useState('');
  const [loadingAlunos, setLoadingAlunos] = useState(true);
  const [loadingResponsaveis, setLoadingResponsaveis] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    async function loadAlunos() {
      try {
        const data = await listAlunos();

        if (isActive) {
          setAlunos(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isActive) {
          setAlunos([]);
        }
      } finally {
        if (isActive) {
          setLoadingAlunos(false);
        }
      }
    }

    loadAlunos();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadResponsaveis(criancaSelecionadaId) {
      if (!criancaSelecionadaId) {
        setResponsaveis([]);
        setResponsavelId('');
        return;
      }

      setLoadingResponsaveis(true);

      try {
        const data = await listResponsaveisDaCrianca(criancaSelecionadaId);

        if (isActive) {
          const responsaveisDaCrianca = Array.isArray(data) ? data : [];
          setResponsaveis(responsaveisDaCrianca);
          setResponsavelId(responsaveisDaCrianca.length === 1 ? String(responsaveisDaCrianca[0].responsavelId) : '');
        }
      } catch {
        if (isActive) {
          setResponsaveis([]);
          setResponsavelId('');
        }
      } finally {
        if (isActive) {
          setLoadingResponsaveis(false);
        }
      }
    }

    loadResponsaveis(criancaId);

    return () => {
      isActive = false;
    };
  }, [criancaId]);

  const alunoSelecionado = useMemo(
    () => alunos.find((aluno) => String(aluno.id) === String(criancaId)),
    [alunos, criancaId]
  );

  const fecharScanner = async () => {
  if (scannerRef.current) {
    try {
      await scannerRef.current.stop();
    } catch (error) {
      console.warn("Erro ao parar o scanner:", error);
    }

    try {
      await scannerRef.current.clear();
    } catch (error) {
      console.warn("Erro ao limpar o scanner:", error);
    }

    scannerRef.current = null;
  }

  setScannerOpen(false);
};

  const abrirScanner = () => {
    setError('');
    setMessage('');
    setScannerError('');
    setScannerOpen(true);
  };

  const usuarioLogado = usuario?.email || localStorage.getItem('email') || 'Usuário autenticado';

  useEffect(() => {
    if (!scannerOpen) {
      return undefined;
    }

    let active = true;
    const scannerId = 'camera-reader';

    async function iniciarScanner() {
      try {
        const scanner = new Html5Qrcode(scannerId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 240, height: 240 },
          },
          async (decodedText) => {
            if (!active) {
              return;
            }

            try {
              const payload = JSON.parse(decodedText);
              const alunoId = payload?.id;

              if (!alunoId) {
                throw new Error('QR sem identificador do aluno.');
              }

              const alunoEncontrado = alunos.find((aluno) => String(aluno.id) === String(alunoId));

              if (!alunoEncontrado) {
                throw new Error('Aluno não encontrado.');
              }

              setCriancaId(String(alunoId));
              setResponsavelId('');
              setError('');
              setMessage(`Criança identificada: ${alunoEncontrado.nome}. Agora selecione o responsável para concluir.`);
              await fecharScanner();
            } catch {
              setScannerError('QR Code inválido. Escaneie o QR gerado para a criança.');
            }
          }
        );
      } catch {
        if (active) {
          setScannerError('Não foi possível abrir a câmera do dispositivo. Verifique a permissão e tente novamente.');
        }
      }
    }

    iniciarScanner();

    return () => {
      active = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {}).finally(() => {
          scannerRef.current?.clear().catch(() => {});
          scannerRef.current = null;
        });
      }
    };
  }, [scannerOpen, alunos]);

  const extrairMensagemErro = (error) => {
    return formatApiError(error, 'Não foi possível registrar a movimentação. Verifique os dados e tente novamente.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const criancaSelecionadaId = Number(criancaId);
    const responsavelSelecionadoId = Number(responsavelId);

    if (!usuario?.token) {
      setError('Faça login novamente para registrar a movimentação.');
      setMessage('');
      return;
    }

    if (!criancaSelecionadaId || !responsavelSelecionadoId) {
      setError('Selecione a criança e o responsável para continuar.');
      setMessage('');
      return;
    }

    if (!alunoSelecionado) {
      setError('Selecione uma criança válida.');
      setMessage('');
      return;
    }

    if (!responsaveis.some((responsavel) => Number(responsavel.responsavelId) === responsavelSelecionadoId)) {
      setError('Selecione um responsável vinculado à criança escolhida.');
      setMessage('');
      return;
    }

    try {
      const registro = await registrarMovimentacao(tipo, {
        criancaId: criancaSelecionadaId,
        responsavelId: responsavelSelecionadoId,
        observacao: observacao.trim(),
      });

      const dataHoraRegistro = registro?.dataHora ? formatarDataHora(new Date(registro.dataHora)) : formatarDataHora(new Date());

      setMessage(`${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso em ${dataHoraRegistro}.`);
      setError('');
      setCriancaId('');
      setResponsavelId('');
      setTipo('entrada');
      setObservacao('');
    } catch (error) {
      setError(extrairMensagemErro(error));
      setMessage('');
    }
  };

  const responsavelOptions = responsaveis.map((responsavel) => ({
    value: String(responsavel.responsavelId),
    label: `${responsavel.nome} - ${formatarRelacao(responsavel.relacao)}`,
  }));

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <main className="page">
          <Header
            eyebrow="Registros"
            title="Entrada e saída"
            description="Registre a movimentação vinculando criança e responsável. O funcionário e o horário são capturados automaticamente pela API."
          />

          <section className="panel" style={{ marginTop: '22px' }}>
            <div className="form-grid" style={{ marginBottom: '20px' }}>
              <div className="field field--full">
                <label>Funcionário logado</label>
                <input value={usuarioLogado} readOnly />
              </div>

              <div className="field">
                <label>Horário atual</label>
                <input value={formatarDataHora(currentTime)} readOnly />
              </div>

              <div className="field">
                <label>Status da API</label>
                <input value={loadingAlunos ? 'Carregando crianças...' : 'Pronto para registrar'} readOnly />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="registro-crianca">Criança</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
                    <select
                      id="registro-crianca"
                      value={criancaId}
                      onChange={(event) => setCriancaId(event.target.value)}
                      disabled={loadingAlunos}
                      required
                      style={{ flex: 1 }}
                    >
                      <option value="">{loadingAlunos ? 'Carregando crianças...' : 'Selecione uma criança'}</option>
                      {alunos.map((aluno) => (
                        <option key={aluno.id} value={aluno.id}>
                          {aluno.nome} {aluno.turma ? `- ${aluno.turma}` : ''}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="button button--secondary"
                      onClick={abrirScanner}
                      disabled={loadingAlunos}
                      aria-label="Abrir câmera para ler QR Code"
                      title="Abrir câmera para ler QR Code"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
                    >
                      <CameraIcon />
                      Ler QR
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="registro-responsavel">Responsável</label>
                  <select
                    id="registro-responsavel"
                    value={responsavelId}
                    onChange={(event) => setResponsavelId(event.target.value)}
                    disabled={!criancaId || loadingResponsaveis}
                    required
                  >
                    <option value="">
                      {!criancaId
                        ? 'Selecione a criança primeiro'
                        : loadingResponsaveis
                          ? 'Carregando responsáveis...'
                          : responsaveis.length > 0
                            ? 'Selecione um responsável'
                            : 'Nenhum responsável vinculado'}
                    </option>
                    {responsavelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field field--full">
                  <label htmlFor="registro-tipo">Tipo de movimentação</label>
                  <select id="registro-tipo" value={tipo} onChange={(event) => setTipo(event.target.value)} required>
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>

                <div className="field field--full">
                  <label htmlFor="registro-observacao">Observação</label>
                  <textarea
                    id="registro-observacao"
                    value={observacao}
                    onChange={(event) => setObservacao(event.target.value)}
                    placeholder="Ex.: aluno chegou acompanhado, houve atraso, retorno após atendimento..."
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="actions-row" style={{ marginTop: '20px' }}>
                <button type="submit" className="button" disabled={loadingAlunos || loadingResponsaveis}>
                  Registrar
                </button>
              </div>

              <div className="notice" style={{ marginTop: '16px' }}>
                O horário do registro será salvo automaticamente pela API com base no momento do envio.
              </div>

              {error && <div className="notice notice--error">{error}</div>}
              {message && <div className="notice">{message}</div>}
            </form>
          </section>
        </main>
      </div>

      {scannerOpen && (
        <div
          className="modal"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
          }}
        >
          <div
            className="modal__content"
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              width: '520px',
              maxWidth: '96%',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.22)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Ler QR Code</h3>
            <p style={{ marginTop: '8px' }}>Aponte a câmera para o QR Code da criança. Após ler, selecione o responsável para concluir o registro.</p>

            <div
              id="camera-reader"
              style={{
                width: '100%',
                minHeight: '320px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#111',
                marginTop: '16px',
              }}
            />

            {scannerError && <div className="notice notice--error" style={{ marginTop: '12px' }}>{scannerError}</div>}

            <div className="actions-row" style={{ marginTop: '16px', justifyContent: 'flex-end' }}>
              <button type="button" className="button button--secondary" onClick={fecharScanner}>
                Fechar câmera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}