import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute.jsx';
import CadastroAluno from '../pages/alunos/CadastroAluno.jsx';
import ListaAlunos from '../pages/alunos/ListaAlunos.jsx';
import CadastroFuncionario from '../pages/funcionarios/CadastroFuncionario.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/auth/Login.jsx';
import EntradaSaida from '../pages/registros/EntradaSaida.jsx';
import Relatorio from '../pages/registros/Relatorio.jsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/alunos/cadastro"
          element={
            <ProtectedRoute>
              <CadastroAluno />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alunos"
          element={
            <ProtectedRoute>
              <ListaAlunos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funcionarios/cadastro"
          element={
            <ProtectedRoute>
              <CadastroFuncionario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registros/entrada-saida"
          element={
            <ProtectedRoute>
              <EntradaSaida />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registros/relatorio"
          element={
            <ProtectedRoute>
              <Relatorio />
            </ProtectedRoute>
          }
        />

        <Route path="/cadastro-alunos" element={<Navigate to="/alunos/cadastro" replace />} />
        <Route path="/cadastro-professor" element={<Navigate to="/funcionarios/cadastro" replace />} />
        <Route path="/relatorio" element={<Navigate to="/registros/relatorio" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}