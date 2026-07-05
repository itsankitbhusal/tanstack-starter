import { create } from 'zustand';
import { tokenManager } from '@/lib/token-manager';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  setToken: (token: string) => {
    tokenManager.setTokens(token);
    set({ token, isAuthenticated: true });
  },
  setUser: (user: User | null) => set({ user }),
  logout: () => {
    tokenManager.clearTokens();
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
