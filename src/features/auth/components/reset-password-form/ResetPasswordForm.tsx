import { ArrowLeft, Save } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { usePublicAuthContext } from '@/contexts/PublicAuthContext';
import { t } from '@/i18n/i18n';

interface ResetPasswordFormProps {
  onSubmit: (newPassword: string, confirmPassword: string) => Promise<void>
  isSubmitting: boolean
  onBackToLogin: () => void
}

export function ResetPasswordForm({
  onSubmit,
  isSubmitting,
  onBackToLogin,
}: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { tenantName } = usePublicAuthContext();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(newPassword, confirmPassword);
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
        {t('auth.resetPassword.title')}
      </h1>
      <p className="mb-8 text-center text-xs text-muted-foreground">
        {t('auth.resetPassword.subtitle')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="auth-reset-password"
            className="text-sm font-medium text-foreground"
          >
            {t('auth.resetPassword.newPassword.label')}{' '}
            <span className="text-destructive">{t('common.required')}</span>
          </label>
          <input
            id="auth-reset-password"
            type="password"
            placeholder={t('auth.resetPassword.newPassword.placeholder')}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="auth-reset-confirm-password"
            className="text-sm font-medium text-foreground"
          >
            {t('auth.resetPassword.confirmPassword.label')}{' '}
            <span className="text-destructive">{t('common.required')}</span>
          </label>
          <input
            id="auth-reset-confirm-password"
            type="password"
            placeholder={t('auth.resetPassword.confirmPassword.placeholder')}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70"
        >
          {isSubmitting ? (
            t('auth.resetPassword.submitting')
          ) : (
            <>
              <Save size={18} />
              {t('auth.resetPassword.submit')}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-semibold text-foreground transition-all hover:bg-muted"
        >
          <ArrowLeft size={18} />
          {t('auth.resetPassword.backToLogin')}
        </button>
      </form>
    </div>
  );
}
