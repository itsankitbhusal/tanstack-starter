import { describe, it, expect } from 'vitest';
import { t } from './i18n';

describe('t', () => {
  it('returns translation for valid key', () => {
    expect(t('auth.login.title')).toBe('Welcome Back!');
  });

  it('returns key if translation not found', () => {
    expect(t('invalid.key')).toBe('invalid.key');
  });

  it('replaces parameters in translation', () => {
    const result = t('auth.login.subtitle', 'en', { tenantName: 'TestTenant' });
    expect(result).toBe('Sign in to continue to TestTenant Dashboard');
  });

  it('returns key if value is not a string', () => {
    expect(t('common')).toBe('common');
  });
});
