import { createContext, useContext, useState, useEffect } from "react";

// Define la interfaz para el valor del contexto para que TypeScript sepa qué esperar.
interface AuthContextType {
  user: { email: string } | null;
  properties: any[];
  login: (email: string, password?: string) => void;
  register: (email: string, password?: string) => void;
  logout: () => void;
  addProperty: (property: any) => void;
}

// Crea el contexto con un valor por defecto que coincide con la interfaz.
const AuthContext = createContext<AuthContextType>({
  user: null,
  properties: [],
  login: () => {},
  register: () => {},
  logout: () => {},
  addProperty: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email, password) => {
    const newUser = { email };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const register = (email, password) => {
    const newUser = { email };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const addProperty = (property) => {
    setProperties((prev) => [...prev, property]);
  };

  const value = {
    user,
    login,
    register,
    logout,
    properties,
    addProperty,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}