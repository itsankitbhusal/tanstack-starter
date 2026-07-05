import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { LoginForm } from '@/features/auth/components/index';
import { type LoginFormValues } from '@/lib/schemas/index';
import { useLogin } from '@/hooks/use-auth';

export const Route = createFileRoute('/_public/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useLogin();

  const handleSubmit = async (data: LoginFormValues) => {
    await login({
      username: data.username,
      password: data.password,
    });
  };

  const handleForgotPassword = () => {
    navigate({ to: '/forgot-password' });
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      onForgotPassword={handleForgotPassword}
    />
  );
}
