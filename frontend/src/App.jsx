import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Login from './pages/login.jsx';
import CadastroAlunos from './pages/cadastro-alunos.jsx';
import CadastroProfessor from './pages/cadastro-professor.jsx';
import Relatorio from './pages/relatorio.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-alunos" element={<CadastroAlunos />} />
        <Route path="/cadastro-professor" element={<CadastroProfessor />} />
        <Route path="/relatorio" element={<Relatorio />} />
        <Route path="*" element={<h1>Página não encontrada!</h1>} />
      </Routes>
    </Router>
  );
}

export default App;