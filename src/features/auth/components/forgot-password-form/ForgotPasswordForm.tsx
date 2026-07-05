import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { usePublicAuthContext } from '@/contexts/PublicAuthContext';
import { t } from '@/i18n/i18n';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>
  isSubmitting: boolean
  onBackToLogin: () => void
}

export function ForgotPasswordForm({
  onSubmit,
  isSubmitting,
  onBackToLogin,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const { tenantName } = usePublicAuthContext();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(email);
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-center">
        <img
          src="/Logo.png"
          alt={`${tenantName} logo`}
          className="h-16 w-auto object-contain"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <h1 className="mb-2 text-center text-2xl font-semibold text-foreground">
        {t('auth.forgotPassword.title')}
      </h1>
      <p className="mb-8 text-center text-xs text-muted-foreground">
        {t('auth.forgotPassword.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="auth-forgot-email"
            className="text-sm font-medium text-foreground"
          >
            {t('auth.forgotPassword.email.label')}{' '}
            <span className="text-destructive">{t('common.required')}</span>
          </label>
          <input
            id="auth-forgot-email"
            type="email"
            placeholder={t('auth.forgotPassword.email.placeholder')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70"
        >
          {isSubmitting ? (
            t('auth.forgotPassword.submitting')
          ) : (
            <>
              <ChevronRight size={18} />
              {t('common.next')}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-semibold text-foreground transition-all hover:bg-muted"
        >
          <ArrowLeft size={18} />
          {t('auth.forgotPassword.backToLogin')}
        </button>
      </form>
    </div>
  );
}
