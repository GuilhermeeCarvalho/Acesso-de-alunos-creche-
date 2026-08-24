import { useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { createAluno, uploadDocumento } from '../../services/alunoService.js';
import { createResponsavel } from '../../services/responsavelService.js';
import { createVinculo } from '../../services/vinculoService.js';
import { formatApiError } from '../../utils/errorFormatter.js';

const relacaoOptions = ['PAI', 'MAE', 'IRMAO', 'TIO', 'AVO', 'RESPONSAVEL_LEGAL'];

const createResponsavelForm = () => ({
  nome: '',
  telefone: '',
  relacao: 'RESPONSAVEL_LEGAL',
});

export default function CadastroAluno() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const turmaOptions = [
    'Berçário',
    'Maternal IA',
    'Maternal IB',
    'Maternal IIA',
    'Maternal IIB',
    'Maternal IIC',
    'Maternal IID',
    'Maternal IIE',
    'Maternal IIF',
    'PRÉ IA',
    'PRÉ IB',
    'PRÉ IC',
    'PRÉ IIA',
    'PRÉ IIB',
    'PRÉ IIC'
  ];

  const [creatingTurma, setCreatingTurma] = useState(false);
  const [novaTurma, setNovaTurma] = useState('');
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [responsaveis, setResponsaveis] = useState([createResponsavelForm()]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [precisaPlantao, setPrecisaPlantao] = useState(false);
  const [turno, setTurno] = useState('');
  const [arquivoDocumento, setArquivoDocumento] = useState(null);

  const addResponsavel = () => {
    setResponsaveis((current) => [...current, createResponsavelForm()]);
  };

  const removeResponsavel = (index) => {
    setResponsaveis((current) => {
      if (current.length === 1) return current;
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const updateResponsavel = (index, field, value) => {
    setResponsaveis((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');

    const nomeLimpo = nome.trim();
    const turmaFinal = creatingTurma ? novaTurma.trim() : turma.trim();

    const responsaveisLimpos = responsaveis.map((responsavel) => ({
      nome: responsavel.nome.trim(),
      telefone: responsavel.telefone.trim(),
      relacao: responsavel.relacao,
    }));

    if (!nomeLimpo || !turmaFinal) {
      setError('Informe o nome do aluno e a turma para continuar.');
      return;
    }

    if (responsaveisLimpos.length === 0) {
      setError('Adicione ao menos um responsável.');
      return;
    }

    const responsavelInvalido = responsaveisLimpos.find(
      (responsavel) => !responsavel.nome || !responsavel.telefone || !responsavel.relacao
    );

    if (responsavelInvalido) {
      setError('Informe os dados do aluno e do responsável para continuar.');
      return;
    }

    if (precisaPlantao && !arquivoDocumento) {
      setError('Para alunos que precisam de plantão, é obrigatório anexar documento.');
      return;
    }

    try {
      // cria a criança SEM plantão primeiro
      // porque o backend valida documento quando precisaPlantao = true
      const novoAluno = await createAluno({
        nome: nomeLimpo,
        turma: turmaFinal,
        precisaPlantao: false,
        turno: turno.trim() || null,
      });

      // se marcou plantão, apenas sobe o documento
      if (precisaPlantao) {
        await uploadDocumento(novoAluno.id, arquivoDocumento);
      }

      const responsaveisCriados = await Promise.all(
        responsaveisLimpos.map(async (responsavel) => {
          const novoResponsavel = await createResponsavel({
            nome: responsavel.nome,
            telefone: responsavel.telefone,
          });

          await createVinculo({
            criancaId: novoAluno.id,
            responsavelId: novoResponsavel.id,
            relacao: responsavel.relacao,
          });

          return novoResponsavel;
        })
      );

      setMessage(
        `Aluno cadastrado com sucesso com ${responsaveisCriados.length} responsável(eis) vinculado(s).`
      );

      setNome('');
      setTurma('');
      setNovaTurma('');
      setCreatingTurma(false);
      setResponsaveis([createResponsavelForm()]);
      setPrecisaPlantao(false);
      setTurno('');
      setArquivoDocumento(null);
    } catch (err) {
      setError(formatApiError(err, 'Não foi possível cadastrar o aluno. Verifique os dados e tente novamente.'));
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <main className="page">
          <Header
            eyebrow="Alunos"
            title="Cadastro de aluno"
            description="Cadastre a criança e um ou mais responsáveis, depois vincule todos no backend."
          />

          <section className="panel" style={{ marginTop: '22px' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="aluno-nome">Nome do aluno</label>
                  <input
                    id="aluno-nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="aluno-turma">Turma</label>
                  <select
                    id="aluno-turma"
                    value={creatingTurma ? '__create_new' : turma}
                    onChange={(event) => {
                      const val = event.target.value;
                      if (val === '__create_new') {
                        setCreatingTurma(true);
                        setTurma('');
                      } else {
                        setCreatingTurma(false);
                        setTurma(val);
                      }
                    }}
                    required
                  >
                    <option value="">Selecione a turma</option>
                    {turmaOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    {isAdmin && <option value="__create_new">Criar nova turma</option>}
                  </select>

                  {creatingTurma && isAdmin && (
                    <input
                      id="aluno-nova-turma"
                      value={novaTurma}
                      onChange={(event) => setNovaTurma(event.target.value)}
                      placeholder="Nome da nova turma"
                      required
                      style={{ marginTop: '8px' }}
                    />
                  )}
                </div>

                <div className="field">
                  <label htmlFor="aluno-turno">Turno</label>
                  <select
                    id="aluno-turno"
                    value={turno}
                    onChange={(event) => setTurno(event.target.value)}
                  >
                    <option value="">Selecione o turno</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Matutino">Matutino</option>
                  </select>
                </div>

                <div className="field field--full">
                  <label>Precisa de Plantão?</label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className={precisaPlantao ? 'button button--secondary' : 'button'}
                      style={{ minHeight: '40px', padding: '0 16px' }}
                      onClick={() => setPrecisaPlantao(true)}
                    >
                      Sim
                    </button>
                    <button
                      type="button"
                      className={!precisaPlantao ? 'button button--secondary' : 'button'}
                      style={{ minHeight: '40px', padding: '0 16px' }}
                      onClick={() => setPrecisaPlantao(false)}
                    >
                      Não
                    </button>
                  </div>
                </div>

                {precisaPlantao && (
                  <div className="field field--full">
                    <label>Documento (JPG até 5MB)</label>
                    <input
                      type="file"
                      accept="image/jpeg"
                      onChange={(e) => setArquivoDocumento(e.target.files?.[0] || null)}
                    />
                  </div>
                )}
              </div>

              <section style={{ marginTop: '24px' }}>
                <div className="actions-row" style={{ marginBottom: '12px' }}>
                  <strong>Responsáveis</strong>
                  <button type="button" className="button button--secondary" onClick={addResponsavel}>
                    Adicionar responsável
                  </button>
                </div>

                <div className="responsaveis-list" style={{ display: 'grid', gap: '16px' }}>
                  {responsaveis.map((responsavel, index) => (
                    <div key={index} className="panel" style={{ padding: '16px' }}>
                      <div className="actions-row" style={{ marginBottom: '12px' }}>
                        <strong>Responsável {index + 1}</strong>
                        <button
                          type="button"
                          className="button button--secondary"
                          onClick={() => removeResponsavel(index)}
                          disabled={responsaveis.length === 1}
                        >
                          Remover
                        </button>
                      </div>

                      <div className="form-grid">
                        <div className="field">
                          <label htmlFor={`responsavel-nome-${index}`}>Nome do responsável</label>
                          <input
                            id={`responsavel-nome-${index}`}
                            value={responsavel.nome}
                            onChange={(event) =>
                              updateResponsavel(index, 'nome', event.target.value)
                            }
                            placeholder="Nome completo"
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor={`responsavel-telefone-${index}`}>
                            Telefone do responsável
                          </label>
                          <input
                            id={`responsavel-telefone-${index}`}
                            value={responsavel.telefone}
                            onChange={(event) =>
                              updateResponsavel(index, 'telefone', event.target.value)
                            }
                            placeholder="Ex.: (47) 99999-9999"
                            required
                          />
                        </div>

                        <div className="field field--full">
                          <label htmlFor={`responsavel-relacao-${index}`}>
                            Relação com a criança
                          </label>
                          <select
                            id={`responsavel-relacao-${index}`}
                            value={responsavel.relacao}
                            onChange={(event) =>
                              updateResponsavel(index, 'relacao', event.target.value)
                            }
                          >
                            {relacaoOptions.map((option) => (
                              <option key={option} value={option}>
                                {option.replaceAll('_', ' ')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="actions-row" style={{ marginTop: '20px' }}>
                <button type="submit" className="button">
                  Salvar aluno
                </button>
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