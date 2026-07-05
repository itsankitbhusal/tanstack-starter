import { axiosClient } from '@/lib/api/axios-client';

const REFRESH_TOKEN_STORAGE_KEY = 'auth-refresh-token';

const isBrowser = typeof window !== 'undefined';

export interface DecodedToken {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

type TokenListener = (tokens: AuthTokens) => void;

class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string | null> | null = null;
  private listeners = new Set<TokenListener>();

  constructor() {
    if (isBrowser) {
      this.loadRefreshToken();
    }
  }

  private base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(str);
    try {
      return decodeURIComponent(
        decoded
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
    } catch {
      return decoded;
    }
  }

  decodeToken(token: string | null): DecodedToken | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(this.base64UrlDecode(payload));
    } catch {
      return null;
    }
  }

  setTokens(accessToken: string, refreshToken?: string | null): void {
    this.accessToken = accessToken || null;
    if (refreshToken !== undefined) {
      this.refreshToken = refreshToken || null;
      this.persistRefreshToken();
    }
    this.notify();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.refreshPromise = null;
    if (isBrowser) {
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }
    this.notify();
  }

  logout(): void {
    this.clearTokens();
  }

  subscribe(listener: TokenListener): () => void {
    this.listeners.add(listener);
    listener(this.getTokens());
    return () => {
      this.listeners.delete(listener);
    };
  }

  getTokens(): AuthTokens {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  }

  private notify(): void {
    const tokens = this.getTokens();
    this.listeners.forEach((listener) => listener(tokens));
  }

  private loadRefreshToken(): void {
    if (isBrowser) {
      this.refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    }
  }

  private persistRefreshToken(): void {
    if (!isBrowser) return;
    if (this.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, this.refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }
  }

  isAuthenticated(): boolean {
    if (!isBrowser) return false;
    return !!this.getAccessToken() && !this.isAccessTokenExpired();
  }

  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return true;

    return Date.now() >= decoded.exp * 1000;
  }

  async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) return this.refreshPromise;

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    this.refreshPromise = axiosClient
      .post('/oauth/refresh_token', { refreshToken })
      .then((response) => {
        const data = response.data?.data as {
          access_token?: string;
          accessToken?: string;
          refresh_token?: string;
          refreshToken?: string;
        } | undefined;
        const nextAccessToken = data?.access_token || data?.accessToken || null;
        const nextRefreshToken = data?.refresh_token || data?.refreshToken;

        if (!nextAccessToken) {
          this.clearTokens();
          return null;
        }

        this.setTokens(nextAccessToken, nextRefreshToken ?? refreshToken);
        return nextAccessToken;
      })
      .catch(() => {
        this.clearTokens();
        return null;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }
}

export const tokenManager = new TokenManager();
