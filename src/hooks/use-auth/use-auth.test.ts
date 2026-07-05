import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    setTokens: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('@/lib/api/axios-client', () => ({
  axiosClient: {
    post: vi.fn(),
  },
  BASE_URL: '/api',
}));

describe('useLogout', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return logout function and isLoading state', async () => {
    const { useLogout } = await import('./index');
    const { result } = renderHook(() => useLogout());

    expect(result.current.logout).toBeDefined();
    expect(typeof result.current.logout).toBe('function');
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useLogin', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return login function and isLoading state', async () => {
    const { useLogin } = await import('./index');
    const { result } = renderHook(() => useLogin());

    expect(result.current.login).toBeDefined();
    expect(typeof result.current.login).toBe('function');
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useForgotPassword', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return forgotPassword function with states', async () => {
    const { useForgotPassword } = await import('./index');
    const { result } = renderHook(() => useForgotPassword());

    expect(result.current.forgotPassword).toBeDefined();
    expect(typeof result.current.forgotPassword).toBe('function');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
  });
});

describe('useResetPassword', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return resetPassword function with states', async () => {
    const { useResetPassword } = await import('./index');
    const { result } = renderHook(() => useResetPassword());

    expect(result.current.resetPassword).toBeDefined();
    expect(typeof result.current.resetPassword).toBe('function');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
  });
});
