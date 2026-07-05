import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
});

Object.defineProperty(globalThis, 'window', {
  value: { location: { href: '' } },
});

describe('tokenManager', () => {
  beforeEach(() => {
    vi.resetModules();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockReturnValue(undefined);
    mockLocalStorage.removeItem.mockReturnValue(undefined);
  });

  it('should initialize with null tokens', async () => {
    const { tokenManager } = await import('./token-manager');
    expect(tokenManager.getAccessToken()).toBeNull();
    expect(tokenManager.getRefreshToken()).toBeNull();
  });

  it('should set access and refresh tokens', async () => {
    const { tokenManager } = await import('./token-manager');
    
    tokenManager.setTokens('access-token', 'refresh-token');
    
    expect(tokenManager.getAccessToken()).toBe('access-token');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refresh-token', 'refresh-token');
  });

  it('should clear tokens', async () => {
    const { tokenManager } = await import('./token-manager');
    
    tokenManager.setTokens('access-token', 'refresh-token');
    tokenManager.clearTokens();
    
    expect(tokenManager.getAccessToken()).toBeNull();
    expect(tokenManager.getRefreshToken()).toBeNull();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refresh-token');
  });

  it('should check if authenticated', async () => {
    const { tokenManager } = await import('./token-manager');
    
    expect(tokenManager.isAuthenticated()).toBe(false);
    
    const payload = { exp: Math.floor(Date.now() / 1000) + 3600 };
    const validToken = `header.${btoa(JSON.stringify(payload))}.signature`;
    
    tokenManager.setTokens(validToken, 'refresh-token');
    expect(tokenManager.isAuthenticated()).toBe(true);
  });

  it('should decode JWT token', async () => {
    const { tokenManager } = await import('./token-manager');
    
    const payload = { exp: Math.floor(Date.now() / 1000) + 3600 };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    
    const decoded = tokenManager.decodeToken(token);
    expect(decoded?.exp).toBe(payload.exp);
  });

  it('should check if token is expired', async () => {
    const { tokenManager } = await import('./token-manager');
    
    const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 3600 };
    const expiredToken = `header.${btoa(JSON.stringify(expiredPayload))}.signature`;
    
    expect(tokenManager.isAccessTokenExpired()).toBe(true);
    
    tokenManager.setTokens(expiredToken, 'refresh');
    expect(tokenManager.isAccessTokenExpired()).toBe(true);
  });

  it('should subscribe to token changes', async () => {
    const { tokenManager } = await import('./token-manager');
    
    const callback = vi.fn();
    const unsubscribe = tokenManager.subscribe(callback);
    
    tokenManager.setTokens('new-token', 'refresh-token');
    
    expect(callback).toHaveBeenCalledWith({
      accessToken: 'new-token',
      refreshToken: 'refresh-token',
    });
    
    unsubscribe();
  });
});
