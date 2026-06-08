import { useEffect, useMemo, useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Table from '../../components/Table.jsx';
import { listFuncionarios } from '../../services/funcionarioService.js';

function formatarRole(role) {
  return role ? String(role).replaceAll('_', ' ') : 'Não informado';
}

export default function ListaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
              ]}
              rows={funcionariosOrdenados.map((funcionario) => ({
                id: funcionario.id,
                nome: funcionario.nome || 'Não informado',
                email: funcionario.email || 'Não informado',
                role: funcionario.role,
              }))}
              emptyMessage="Nenhum funcionário cadastrado."
            />
          </section>
        </main>
      </div>
    </div>
  );
}