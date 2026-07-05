import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { ForgotPasswordForm } from '@/features/auth/components/index';
import { useForgotPassword } from '@/hooks/use-auth';

export const Route = createFileRoute('/_public/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword, isLoading } = useForgotPassword();

  const handleSubmit = async (email: string) => {
    const response = await forgotPassword({ emailOrPhone: email });
    if (response.status === 200) {
      navigate({ to: '/reset-password' });
    }
  };

  const handleBackToLogin = () => {
    navigate({ to: '/login' });
  };

  return (
    <ForgotPasswordForm
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      onBackToLogin={handleBackToLogin}
    />
  );
}
