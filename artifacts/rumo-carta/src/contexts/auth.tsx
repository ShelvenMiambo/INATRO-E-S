import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; // initials-based if not set
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateName: (name: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'rumocarta_user';
const ACCOUNTS_KEY = 'rumocarta_accounts';

type StoredAccount = { id: string; name: string; email: string; password: string; createdAt: string };

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function saveUser(user: User | null) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser);
  const [isLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600)); // simulated delay
    const accounts = loadAccounts();
    const match = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!match) throw new Error('Email ou palavra-passe incorretos.');
    const u: User = { id: match.id, name: match.name, email: match.email, createdAt: match.createdAt };
    saveUser(u);
    setUser(u);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const accounts = loadAccounts();
    if (accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Já existe uma conta com este email.');
    }
    const newAccount: StoredAccount = {
      id: generateId(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    saveAccounts([...accounts, newAccount]);
    const u: User = { id: newAccount.id, name, email, createdAt: newAccount.createdAt };
    saveUser(u);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    saveUser(null);
    setUser(null);
  }, []);

  const updateName = useCallback((name: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, name };
      saveUser(updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}
