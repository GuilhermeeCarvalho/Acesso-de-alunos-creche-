import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    return token ? { email, token } : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token && !usuario) {
      setUsuario({ email, token });
    }
  }, [usuario]);

  async function login(email, senha) {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('senha', senha);

    const response = await api.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const token = response.data?.token;

    if (!token) {
      throw new Error("Resposta inválida: token não encontrado");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("email", email);

    setUsuario({
      email,
      token
    });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");

    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: usuario,
        usuario,
        isAuthenticated: !!usuario,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
