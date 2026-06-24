import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
)