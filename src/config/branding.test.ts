import { describe, it, expect } from 'vitest';
import { defaultBranding, getBranding, setBranding } from './branding';

describe('branding', () => {
  it('has default branding values', () => {
    expect(defaultBranding.tenantId).toBe('default');
    expect(defaultBranding.tenantName).toBe('My App');
    expect(defaultBranding.brandColor).toBe('#0f4c81');
    expect(defaultBranding.brandColorForeground).toBe('#ffffff');
  });

  it('getBranding returns current branding', () => {
    const branding = getBranding();
    expect(branding).toEqual(defaultBranding);
  });

  it('setBranding updates branding config', () => {
    const updated = setBranding({ tenantName: 'NewTenant', brandColor: '#000000' });
    expect(updated.tenantName).toBe('NewTenant');
    expect(updated.brandColor).toBe('#000000');
    expect(updated.tenantId).toBe('default');
  });
});
