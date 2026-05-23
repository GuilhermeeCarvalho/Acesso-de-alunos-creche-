import { useEffect, useMemo, useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { listAlunos } from '../../services/alunoService.js';
import { listResponsaveisDaCrianca } from '../../services/responsavelService.js';
import { registrarMovimentacao } from '../../services/registroService.js';

function formatarDataHora(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date);
}

function formatarRelacao(relacao) {
  return relacao ? relacao.replaceAll('_', ' ') : 'Sem relação';
}

export default function EntradaSaida() {
  const { usuario } = useAuth();
  const [alunos, setAlunos] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [criancaId, setCriancaId] = useState('');
  const [responsavelId, setResponsavelId] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [loadingAlunos, setLoadingAlunos] = useState(true);
  const [loadingResponsaveis, setLoadingResponsaveis] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

  const usuarioLogado = usuario?.email || localStorage.getItem('email') || 'Usuário autenticado';

  const extrairMensagemErro = (error) => {
    return (
      error?.response?.data?.mensagem ||
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Não foi possível registrar a movimentação. Verifique a API e tente novamente.'
    );
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
      });

      const dataHoraRegistro = registro?.dataHora ? formatarDataHora(new Date(registro.dataHora)) : formatarDataHora(new Date());

      setMessage(`${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso em ${dataHoraRegistro}.`);
      setError('');
      setCriancaId('');
      setResponsavelId('');
      setTipo('entrada');
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
                  <select
                    id="registro-crianca"
                    value={criancaId}
                    onChange={(event) => setCriancaId(event.target.value)}
                    disabled={loadingAlunos}
                    required
                  >
                    <option value="">{loadingAlunos ? 'Carregando crianças...' : 'Selecione uma criança'}</option>
                    {alunos.map((aluno) => (
                      <option key={aluno.id} value={aluno.id}>
                        {aluno.nome} {aluno.turma ? `- ${aluno.turma}` : ''}
                      </option>
                    ))}
                  </select>
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
    </div>
  );
}