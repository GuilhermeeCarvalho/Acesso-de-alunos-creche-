import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'acesso-de-alunos-creche:auth';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const value = useMemo(() => {
    const login = async (credentials = {}) => {
      const nextUser = {
        name: credentials.name || credentials.email || 'Usuário',
        email: credentials.email || '',
        token: `demo-${Date.now()}`,
      };

      setUser(nextUser);
      return nextUser;
    };

    const logout = () => setUser(null);

    return {
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}