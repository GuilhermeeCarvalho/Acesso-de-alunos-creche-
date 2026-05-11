import { useEffect, useState } from 'react';

import Header from '../../components/Header.jsx';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Table from '../../components/Table.jsx';
import { listAlunos } from '../../services/alunoService.js';

const fallbackAlunos = [
  { id: 1, nome: 'Ana Clara', turma: 'Jardim II', responsavel: 'Marina Souza' },
  { id: 2, nome: 'Miguel Santos', turma: 'Maternal I', responsavel: 'Carlos Santos' },
];

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState(fallbackAlunos);

  useEffect(() => {
    let isActive = true;

    async function loadAlunos() {
      try {
        const data = await listAlunos();

        if (isActive && Array.isArray(data) && data.length > 0) {
          setAlunos(data);
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

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <main className="page">
          <Header
            eyebrow="Alunos"
            title="Lista de alunos"
            description="Consulta rápida dos alunos cadastrados e de seus responsáveis."
          />

          <section className="panel" style={{ marginTop: '22px' }}>
            <Table
              columns={[
                { key: 'nome', label: 'Nome' },
                { key: 'turma', label: 'Turma' },
                { key: 'responsavel', label: 'Responsável' },
              ]}
              rows={alunos}
              emptyMessage="Nenhum aluno cadastrado."
            />
          </section>
        </main>
      </div>
    </div>
  );
}