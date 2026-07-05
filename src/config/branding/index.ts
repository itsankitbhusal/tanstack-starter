export interface BrandingConfig {
  tenantId: string;
  tenantName: string;
  brandColor: string;
  brandColorForeground: string;
  logoUrl?: string;
  faviconUrl?: string;
}

import logoFull from '@/assets/Logo-full.png?url';
import logoIcon from '@/assets/Logo.png?url';

export const defaultBranding: BrandingConfig = {
  tenantId: 'default',
  tenantName: 'My App',
  brandColor: '#0f4c81',
  brandColorForeground: '#ffffff',
  logoUrl: logoFull as string,
  faviconUrl: logoIcon as string,
};

export const brandingConfig = defaultBranding;

export function getBranding(): BrandingConfig {
  return brandingConfig;
}

export function setBranding(config: Partial<BrandingConfig>): BrandingConfig {
  Object.assign(brandingConfig, config);
  return brandingConfig;
}
