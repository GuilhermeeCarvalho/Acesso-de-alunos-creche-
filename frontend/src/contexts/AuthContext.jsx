import {
  createContext,
  useContext,
  useState
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [usuario, setUsuario] = useState(null);

  async function login(email, senha) {

    const response = await api.post("/auth/login", {
      email,
      senha
    });

    // Axios wraps response in .data, extract the token
    const token = response.data?.token;

    if (!token) {
      throw new Error("Resposta inválida: token não encontrado");
    }

    localStorage.setItem("token", token);

    setUsuario({
      email,
      token
    });
  }

  function logout() {

    localStorage.removeItem("token");

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