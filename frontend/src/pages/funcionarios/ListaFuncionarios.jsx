import { useEffect, useMemo, useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Table from '../../components/Table.jsx';
import { deleteFuncionario, listFuncionarios } from '../../services/funcionarioService.js';

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m-6 0h6m-7 0 .6 11.2A1.5 1.5 0 0 0 10.1 19h3.8a1.5 1.5 0 0 0 1.5-1.8L15.4 7M10 10.5v4.5M14 10.5v4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatarRole(role) {
  return role ? String(role).replaceAll('_', ' ') : 'Não informado';
}

export default function ListaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingFuncionario, setDeletingFuncionario] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadFuncionarios() {
      try {
        const data = await listFuncionarios();

        if (isActive) {
          setFuncionarios(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isActive) {
          setFuncionarios([]);
          setError('Não foi possível carregar a lista de funcionários. Verifique a API e tente novamente.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadFuncionarios();

    return () => {
      isActive = false;
    };
  }, []);

  const funcionariosOrdenados = useMemo(() => {
    return [...funcionarios].sort((a, b) =>
      String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR', { sensitivity: 'base' })
    );
  }, [funcionarios]);

  const quantidadeAdmins = useMemo(() => {
    return funcionariosOrdenados.filter((funcionario) => String(funcionario.role) === 'ADMIN').length;
  }, [funcionariosOrdenados]);

  function openDeleteDialog(funcionario) {
    setDeletingFuncionario(funcionario);
    setDeleteStep(1);
    setDeleteConfirmation('');
    setDeleteError('');
  }

  function closeDeleteDialog() {
    setDeletingFuncionario(null);
    setDeleteStep(1);
    setDeleteConfirmation('');
    setDeleteError('');
  }

  async function confirmDeleteFuncionario() {
    if (!deletingFuncionario) {
      return;
    }

    if (deleteStep === 1) {
      setDeleteStep(2);
      return;
    }

    const confirmationValue = deleteConfirmation.trim().toLowerCase();
    const expectedValue = String(deletingFuncionario.email || '').trim().toLowerCase();

    if (confirmationValue !== expectedValue) {
      setDeleteError('Digite o e-mail exatamente como aparece para confirmar a exclusão.');
      return;
    }

    try {
      await deleteFuncionario(deletingFuncionario.id);
      setFuncionarios((current) => current.filter((funcionario) => funcionario.id !== deletingFuncionario.id));
      closeDeleteDialog();
    } catch (err) {
      const apiMessage = err?.response?.data?.mensagem || err?.response?.data?.message || err?.message;
      setDeleteError(apiMessage || 'Não foi possível excluir o funcionário. Verifique a API e tente novamente.');
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <main className="page">
          <Header
            eyebrow="Funcionários"
            title="Lista de funcionários"
            description="Consulta dos profissionais cadastrados no sistema. Esta área é restrita para administradores."
          />

          <section className="panel" style={{ marginTop: '22px' }}>
            <div className="table-toolbar">
              <div className="table-toolbar__summary">
                <strong>{loading ? '...' : funcionariosOrdenados.length}</strong>
                <span>{loading ? 'carregando' : funcionariosOrdenados.length === 1 ? 'funcionário exibido' : 'funcionários exibidos'}</span>
              </div>
            </div>

            {error && <div className="notice notice--error" style={{ marginBottom: '16px' }}>{error}</div>}

            <Table
              columns={[
                { key: 'nome', label: 'Nome' },
                { key: 'email', label: 'E-mail' },
                { key: 'role', label: 'Role', render: (funcionario) => formatarRole(funcionario.role) },
                {
                  key: 'actions',
                  label: 'Ações',
                  render: (funcionario) => (
                    funcionario.role === 'ADMIN' && quantidadeAdmins === 1 ? (
                      <button
                        type="button"
                        className="button button--secondary button--small"
                        disabled
                        title="O único administrador não pode ser excluído"
                      >
                        Único admin
                      </button>
                    ) : (
                    <button
                      type="button"
                      className="button button--danger button--small"
                      onClick={() => openDeleteDialog(funcionario)}
                      title="Excluir funcionário"
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <TrashIcon />
                        Excluir
                      </span>
                    </button>
                    )
                  ),
                },
              ]}
              rows={funcionariosOrdenados.map((funcionario) => ({
                id: funcionario.id,
                nome: funcionario.nome || 'Não informado',
                email: funcionario.email || 'Não informado',
                role: funcionario.role,
                isUniqueAdmin: String(funcionario.role) === 'ADMIN' && quantidadeAdmins === 1,
              }))}
              emptyMessage="Nenhum funcionário cadastrado."
            />
          </section>
        </main>
      </div>

      {deletingFuncionario && (
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
            <h3 style={{ marginTop: 0 }}>Excluir funcionário</h3>

            {deleteStep === 1 ? (
              <p style={{ marginTop: '8px' }}>
                Esta ação vai remover <strong>{deletingFuncionario.nome}</strong> do sistema. Clique em continuar para iniciar a confirmação em duas etapas.
              </p>
            ) : (
              <>
                <p style={{ marginTop: '8px' }}>
                  Para confirmar a exclusão de <strong>{deletingFuncionario.nome}</strong>, digite o e-mail abaixo exatamente como aparece no cadastro:
                </p>

                <div className="field" style={{ marginTop: '12px' }}>
                  <label htmlFor="delete-confirmation">E-mail do funcionário</label>
                  <input
                    id="delete-confirmation"
                    value={deleteConfirmation}
                    onChange={(event) => setDeleteConfirmation(event.target.value)}
                    placeholder={deletingFuncionario.email}
                    autoComplete="off"
                  />
                </div>
              </>
            )}

            {deleteError && <div className="notice notice--error" style={{ marginTop: '12px' }}>{deleteError}</div>}

            <div className="actions-row" style={{ marginTop: '16px', justifyContent: 'flex-end' }}>
              <button type="button" className="button button--secondary" onClick={closeDeleteDialog}>
                Cancelar
              </button>
              <button type="button" className="button button--danger" onClick={confirmDeleteFuncionario}>
                {deleteStep === 1 ? 'Continuar' : 'Excluir agora'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}