import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import api from "../services/api";

const AuthContext = createContext();

function decodeTokenRole(token) {
  if (!token) {
    return null;
  }

  try {
    const payloadBase64 = token.split('.')[1];

    if (!payloadBase64) {
      return null;
    }

    const normalizedBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = atob(normalizedBase64);
    const payload = JSON.parse(payloadJson);

    return payload?.role || payload?.ROLE || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role") || decodeTokenRole(token);

    return token ? { email, token, role } : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role") || decodeTokenRole(token);

    if (token && !usuario) {
      setUsuario({ email, token, role });
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

    const role = decodeTokenRole(token);

    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }

    setUsuario({
      email,
      token,
      role
    });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

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
