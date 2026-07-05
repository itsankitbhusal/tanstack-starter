import type { ReactNode } from 'react';

import { usePublicAuthContext, PublicAuthProvider } from '@/contexts/PublicAuthContext';
import { AppFooter } from '@/components/app-footer/AppFooter';

import { BRAND } from '@/config/branding/config';

interface AuthLayoutProps {
  brandColor?: string
  tenantName?: string
  logoUrl?: string
  children: ReactNode
}

export function AuthLayout({
  brandColor,
  tenantName,
  logoUrl,
  children,
}: AuthLayoutProps) {
  return (
    <PublicAuthProvider
      brandColor={brandColor}
      tenantName={tenantName}
      logoUrl={logoUrl}
    >
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </PublicAuthProvider>
  );
}

function AuthLayoutContent({ children }: { children: ReactNode }) {
  const { brandColor, tenantName } = usePublicAuthContext();

  const lightGradient = `
    radial-gradient(ellipse at 20% 30%, color-mix(in srgb, ${brandColor} 15%, transparent) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, color-mix(in srgb, ${brandColor} 12%, transparent) 0%, transparent 45%),
    radial-gradient(circle at 50% 80%, color-mix(in srgb, ${brandColor} 8%, transparent) 0%, transparent 40%),
    linear-gradient(180deg, color-mix(in srgb, ${brandColor} 5%, transparent) 0%, transparent 100%)
  `;

  const darkGradient = `
    radial-gradient(ellipse at 20% 30%, color-mix(in srgb, ${brandColor} 45%, transparent) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, color-mix(in srgb, ${brandColor} 35%, transparent) 0%, transparent 45%),
    linear-gradient(115deg, transparent 30%, color-mix(in srgb, ${brandColor} 28%, transparent) 38%, transparent 46%),
    linear-gradient(200deg, color-mix(in srgb, ${brandColor} 22%, transparent) 0%, transparent 35%),
    linear-gradient(115deg, transparent 70%, color-mix(in srgb, ${brandColor} 20%, transparent) 78%, transparent 86%),
    radial-gradient(circle at 30% 40%, color-mix(in srgb, ${brandColor} 22%, transparent) 0%, transparent 40%),
    radial-gradient(circle at 70% 60%, color-mix(in srgb, ${brandColor} 18%, transparent) 0%, transparent 35%),
    linear-gradient(180deg, color-mix(in srgb, ${brandColor} 15%, transparent) 0%, transparent 100%)
  `;

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background p-3">
      {/* Left panel */}
      <div className="relative hidden w-[46%] flex-col justify-between rounded-3xl p-8 lg:flex dark:bg-slate-900">
        <div
          className="absolute inset-0 overflow-hidden rounded-3xl dark:hidden"
          style={{ background: lightGradient }}
        />
        <div
          className="absolute inset-0 overflow-hidden rounded-3xl hidden dark:block"
          style={{ background: darkGradient }}
        >
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background: `
                radial-gradient(circle at 30% 40%, color-mix(in srgb, ${brandColor} 22%, transparent) 0%, transparent 40%),
                radial-gradient(circle at 70% 60%, color-mix(in srgb, ${brandColor} 18%, transparent) 0%, transparent 35%)
              `,
            }}
          />
        </div>

        {/* Top content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img
              src={BRAND.logoIcon}
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Bottom content */}
        <div className="relative z-10 flex max-w-lg flex-col gap-6">
          <p className="text-sm font-medium tracking-wide" style={{ color: '#ffffff' }}>
            {tenantName} | {BRAND.tagline}
          </p>

          <h2 className="text-2xl font-medium leading-snug" style={{ color: '#ffffff' }}>
            {BRAND.description}
          </h2>

          <div className="h-px w-full" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />

          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {BRAND.poweredBy}
          </p>

          <div className="flex items-center gap-5">
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none" style={{ color: '#ffffff' }}>
                {BRAND.gatewayName}
              </span>
              <span className="self-end text-[10px] leading-tight" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {BRAND.gatewaySub}
              </span>
            </div>

            <div className="h-8 w-px" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />

            <div className="flex items-center gap-2">
              <div className="relative h-6 w-8">
                <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-[#eb001b]" />
                <div className="absolute left-2.5 top-0 h-6 w-6 rounded-full bg-[#f79e1b] opacity-80" />
              </div>
              <span className="text-base font-semibold" style={{ color: '#ffffff' }}>
                {BRAND.gatewayType}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex h-full w-full flex-col bg-background lg:w-[54%] lg:px-4">
        <main className="flex flex-1 items-center justify-center overflow-y-auto py-8 sm:px-10">
          <div className="w-full max-w-[360px]">{children}</div>
        </main>

        <AppFooter />
      </div>
    </div>
  );
}
