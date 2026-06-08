import { useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { createAluno } from '../../services/alunoService.js';
import { createResponsavel } from '../../services/responsavelService.js';
import { createVinculo } from '../../services/vinculoService.js';

const relacaoOptions = ['PAI', 'MAE', 'IRMAO', 'TIO', 'AVO', 'RESPONSAVEL_LEGAL'];

const createResponsavelForm = () => ({
  nome: '',
  telefone: '',
  relacao: 'RESPONSAVEL_LEGAL',
});

function extrairMensagemErroBackend(err) {
  const data = err?.response?.data;
  const mensagem = data?.mensagem || data?.message || data?.error;
  const erros = data?.erros;

  if (erros && typeof erros === 'object') {
    const mensagens = Object.entries(erros)
      .map(([campo, valor]) => `${campo}: ${valor}`)
      .filter(Boolean);

    if (mensagens.length > 0) {
      return mensagens.join(' | ');
    }
  }

  if (mensagem) {
    return mensagem;
  }

  return err?.message || 'Não foi possível cadastrar o aluno. Verifique a API e tente novamente.';
}

export default function CadastroAluno() {
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [responsaveis, setResponsaveis] = useState([createResponsavelForm()]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const addResponsavel = () => {
    setResponsaveis((current) => [...current, createResponsavelForm()]);
  };

  const removeResponsavel = (index) => {
    setResponsaveis((current) => {
      if (current.length === 1) {
        return current;
      }

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

    const nomeLimpo = nome.trim();
    const turmaLimpa = turma.trim();
    const responsaveisLimpos = responsaveis.map((responsavel) => ({
      nome: responsavel.nome.trim(),
      telefone: responsavel.telefone.trim(),
      relacao: responsavel.relacao,
    }));

    if (!nomeLimpo || !turmaLimpa) {
      setError('Informe o nome do aluno e a turma para continuar.');
      setMessage('');
      return;
    }

    if (responsaveisLimpos.length === 0) {
      setError('Adicione ao menos um responsável.');
      setMessage('');
      return;
    }

    const responsavelInvalido = responsaveisLimpos.find(
      (responsavel) => !responsavel.nome || !responsavel.telefone || !responsavel.relacao
    );

    if (responsavelInvalido) {
      setError('Informe os dados do aluno e do responsável para continuar.');
      setMessage('');
      return;
    }

    try {
      const novoAluno = await createAluno({ nome: nomeLimpo, turma: turmaLimpa });

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

      setMessage(`Aluno cadastrado com sucesso com ${responsaveisCriados.length} responsável(eis) vinculado(s).`);
      setError('');
      setNome('');
      setTurma('');
      setResponsaveis([createResponsavelForm()]);
    } catch (err) {
      setError(extrairMensagemErroBackend(err));
      setMessage('');
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
                  <input
                    id="aluno-turma"
                    value={turma}
                    onChange={(event) => setTurma(event.target.value)}
                    placeholder="Ex.: Jardim II"
                    required
                  />
                </div>
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
                            onChange={(event) => updateResponsavel(index, 'nome', event.target.value)}
                            placeholder="Nome completo"
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor={`responsavel-telefone-${index}`}>Telefone do responsável</label>
                          <input
                            id={`responsavel-telefone-${index}`}
                            value={responsavel.telefone}
                            onChange={(event) => updateResponsavel(index, 'telefone', event.target.value)}
                            placeholder="Ex.: (47) 99999-9999"
                            required
                          />
                        </div>

                        <div className="field field--full">
                          <label htmlFor={`responsavel-relacao-${index}`}>Relação com a criança</label>
                          <select
                            id={`responsavel-relacao-${index}`}
                            value={responsavel.relacao}
                            onChange={(event) => updateResponsavel(index, 'relacao', event.target.value)}
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