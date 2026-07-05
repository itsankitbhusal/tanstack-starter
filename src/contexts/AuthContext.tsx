import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from 'react';

import { tokenManager } from '@/lib/token-manager';
import { setupInterceptors } from '@/lib/api/axios-client';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextValue {
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
  setTokens: (accessToken: string, refreshToken?: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthLoading: true,
  isAuthenticated: false,
  accessToken: null,
  user: null,
  setTokens: () => {},
  setUser: () => {},
  logout: () => {},
});

const AUTH_MESSAGE_KEY = 'auth_message';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState(tokenManager.getAccessToken());
  const [isAuthLoading, setIsAuthLoading] = useState(
    !!tokenManager.getRefreshToken() && !tokenManager.getAccessToken(),
  );
  const [isAuthenticated, setIsAuthenticated] = useState(() => tokenManager.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setupInterceptors(
      () => tokenManager.getAccessToken(),
      () => tokenManager.getRefreshToken(),
      (access, refresh) => tokenManager.setTokens(access, refresh),
      () => tokenManager.clearTokens(),
      () => {},
    );
  }, []);

  useEffect(() => 
     
     tokenManager.subscribe((tokens) => {
      setAccessToken(tokens.accessToken);
      setIsAuthenticated(!!tokens.accessToken && !tokenManager.isAccessTokenExpired());
    })
  , []);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      if (tokenManager.getAccessToken() || !tokenManager.getRefreshToken()) {
        setIsAuthLoading(false);
        return;
      }

      const token = await tokenManager.refreshAccessToken();
      if (!mounted) return;

      setIsAuthenticated(!!token);
      setIsAuthLoading(false);
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const setTokens = useCallback((accessToken: string, refreshToken?: string | null) => {
    tokenManager.setTokens(accessToken, refreshToken);
    setAccessToken(accessToken || null);
    setIsAuthenticated(!!accessToken && !tokenManager.isAccessTokenExpired());
  }, []);

  const logout = useCallback(() => {
    tokenManager.logout();
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);

    sessionStorage.setItem(
      AUTH_MESSAGE_KEY,
      JSON.stringify({
        type: 'error',
        message: 'Your session has expired. Please log in again.',
      }),
    );

    window.location.href = '/login';
  }, []);

  const value = useMemo(
    () => ({
      isAuthLoading,
      isAuthenticated,
      accessToken,
      user,
      setTokens,
      setUser,
      logout,
    }),
    [accessToken, isAuthLoading, isAuthenticated, logout, user, setTokens],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export { AUTH_MESSAGE_KEY };
