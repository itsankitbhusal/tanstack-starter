import { createContext, useContext, type ReactNode } from 'react';

import { defaultBranding, type BrandingConfig } from '@/config/index';

type PublicAuthContextValue = BrandingConfig;

const defaultValue: PublicAuthContextValue = defaultBranding;

const PublicAuthContext = createContext<PublicAuthContextValue>(defaultValue);

interface PublicAuthProviderProps extends Partial<BrandingConfig> {
  children: ReactNode
}

export function PublicAuthProvider({
  tenantId,
  tenantName,
  brandColor,
  brandColorForeground,
  logoUrl,
  faviconUrl,
  children,
}: PublicAuthProviderProps) {
  return (
    <PublicAuthContext.Provider
      value={{
        tenantId: tenantId ?? defaultValue.tenantId,
        tenantName: tenantName ?? defaultValue.tenantName,
        brandColor: brandColor ?? defaultValue.brandColor,
        brandColorForeground: brandColorForeground ?? defaultValue.brandColorForeground,
        logoUrl: logoUrl ?? defaultValue.logoUrl,
        faviconUrl: faviconUrl ?? defaultValue.faviconUrl,
      }}
    >
      {children}
    </PublicAuthContext.Provider>
  );
}

export function usePublicAuthContext() {
  return useContext(PublicAuthContext);
}
