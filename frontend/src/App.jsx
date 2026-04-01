import { useState } from 'react'
import './App.css'

function App() {
  const [mensagem, setMensagem] = useState("Clique no botão para testar a conexão!")

  // Função para testar se o React alcança o Java
  const testarConexao = async () => {
    try {
      const response = await fetch('http://localhost:8080/teste') // URL do seu servidor Java
      const data = await response.json()
      setMensagem(data.mensagem)
    } catch (error) {
      setMensagem("Erro: O servidor Java está desligado ou o CORS bloqueou!")
      console.error(error)
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#646cff' }}>Sistema Creche - Acesso Legal 👶</h1>
      <div className="card">
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{mensagem}</p>
        <button onClick={testarConexao} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Testar Conexão com Java
        </button>
      </div>
      <p style={{ marginTop: '30px', color: '#888' }}>
        Desenvolvido pelo Front-end do Grupo 🚀
      </p>
    </div>
  )
}

export default App