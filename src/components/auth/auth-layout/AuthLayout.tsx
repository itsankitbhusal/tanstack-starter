import type { ReactNode } from 'react';

import { usePublicAuthContext, PublicAuthProvider } from '@/contexts/PublicAuthContext';
import { AppFooter } from '@/components/app-footer/AppFooter';
import { t } from '@/i18n/i18n';
import { BRAND } from '#/config';

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

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background p-3">
      {/* Left panel */}
      <div className="relative hidden w-[46%] flex-col justify-between rounded-3xl p-8 lg:flex">
        <div
          className="absolute inset-0 overflow-hidden rounded-3xl"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, color-mix(in srgb, ${brandColor} 45%, transparent) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, color-mix(in srgb, ${brandColor} 35%, transparent) 0%, transparent 45%),
              radial-gradient(ellipse at 60% 80%, color-mix(in srgb, white 18%, transparent) 0%, transparent 55%),
              linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)
            `,
          }}
        >
          {/* Animated gradient streaks */}
          <div
            className="pointer-events-none absolute -inset-[25%] animate-[auth-streak-drift_20s_ease-in-out_infinite] opacity-60"
            style={{
              background: `
                linear-gradient(115deg, transparent 30%, color-mix(in srgb, ${brandColor} 28%, transparent) 38%, transparent 46%),
                linear-gradient(115deg, transparent 50%, color-mix(in srgb, white 14%, transparent) 58%, transparent 66%),
                linear-gradient(115deg, transparent 70%, color-mix(in srgb, ${brandColor} 20%, transparent) 78%, transparent 86%)
              `,
              filter: 'blur(28px)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 animate-[auth-pulse-glow_8s_ease-in-out_infinite]"
            style={{
              background: `
                radial-gradient(circle at 30% 40%, color-mix(in srgb, ${brandColor} 22%, transparent) 0%, transparent 40%),
                radial-gradient(circle at 70% 60%, color-mix(in srgb, white 10%, transparent) 0%, transparent 40%)
              `,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.12) 0 0.5px, transparent 0.6px), radial-gradient(circle, rgba(0,0,0,0.25) 0 0.6px, transparent 0.7px)',
              backgroundPosition: '0 0, 2px 2px',
              backgroundSize: '4px 4px, 5px 5px',
              opacity: 0.14,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, transparent 35%, transparent 65%, rgba(10,10,10,0.5) 100%)',
            }}
          />
        </div>

        {/* Top logo */}
        <div className="relative z-10">
          <img
            src={BRAND.logoIcon}
            alt={`${tenantName} logo`}
            className="h-16 w-auto object-contain"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Bottom content */}
        <div className="relative z-10 flex max-w-lg flex-col gap-6">
          <p className="text-sm font-medium tracking-wide text-white/70">
            {tenantName} {t('layout.auth.tagline')}
          </p>

          <h2 className="text-2xl font-medium leading-snug text-white">
            {t('layout.auth.description')}
          </h2>

          <div className="h-px w-full bg-white/25" />

          <p className="text-xs text-white/60">
            {t('layout.auth.poweredBy')}
          </p>

          <div className="flex items-center gap-5">
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none text-white">
                {t('layout.auth.cybersource')}
              </span>
              <span className="self-end text-[10px] leading-tight text-white/60">
                {t('layout.auth.cybersourceSub')}
              </span>
            </div>

            <div className="h-8 w-px bg-white/30" />

            <div className="flex items-center gap-2">
              <div className="relative h-6 w-8">
                <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-[#eb001b]" />
                <div className="absolute left-2.5 top-0 h-6 w-6 rounded-full bg-[#f79e1b] opacity-80" />
              </div>
              <span className="text-base font-semibold text-white">
                {t('layout.auth.gateway')}
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
