import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { usePublicAuthContext } from '@/contexts/PublicAuthContext';
import { loginSchema, type LoginFormValues } from '@/lib/schemas/index';
import { t } from '@/i18n/i18n';
import { BRAND } from '#/config';

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => Promise<unknown>
  isSubmitting: boolean
  onForgotPassword: () => void
}

export function LoginForm({
  onSubmit,
  isSubmitting,
  onForgotPassword,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { tenantName } = usePublicAuthContext();

  const form = useForm<LoginFormValues>({
    defaultValues: { username: '', password: '' },
    resolver: zodResolver(loginSchema),
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = form;

  const passwordValue = watch('password');

  const handleFormSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    await onSubmit({
      username: data.username.trim(),
      password: data.password.trim(),
    });
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-center">
        <img
          src={BRAND.logoFull}
          alt={`${tenantName} logo`}
          className="h-16 w-auto object-contain"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <h1 className="mb-2 text-center text-2xl font-semibold text-foreground">
        {t('auth.login.title')}
      </h1>
      <p className="mb-8 text-center text-xs text-muted-foreground">
        {t('auth.login.subtitle', 'en', { tenantName })}
      </p>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="auth-login-email"
            className="text-sm font-medium text-foreground"
          >
            {t('auth.login.email.label')}{' '}
            <span className="text-destructive">{t('common.required')}</span>
          </label>
          <input
            id="auth-login-email"
            {...register('username')}
            type="text"
            placeholder={t('auth.login.email.placeholder')}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          {errors.username && (
            <p className="text-xs text-destructive">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="auth-login-password"
            className="text-sm font-medium text-foreground"
          >
            {t('auth.login.password.label')}{' '}
            <span className="text-destructive">{t('common.required')}</span>
          </label>
          <div className="relative">
            <input
              id="auth-login-password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.login.password.placeholder')}
              className="h-10 w-full rounded-md border border-border bg-background px-3 pr-10 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            {passwordValue?.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-0 top-0 flex h-10 items-center pr-3 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            className="cursor-pointer text-sm font-semibold text-foreground underline transition-colors hover:text-primary"
            onClick={onForgotPassword}
          >
            {t('auth.login.forgotPassword')}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-70"
        >
          {isSubmitting ? (
            t('auth.login.submitting')
          ) : (
            <>
              <ArrowRight size={18} />
              {t('auth.login.submit')}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
