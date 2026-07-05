import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';

import { ResetPasswordForm } from '@/features/auth/components/index';
import { useResetPassword } from '@/hooks/use-auth';

export const Route = createFileRoute('/_public/reset-password')({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useResetPassword();

  const handleSubmit = async (newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const response = await resetPassword({
      emailOrPhone: 'user@example.com',
      otp: '123456',
      newPassword,
    });
    if (response.status === 200) {
      navigate({ to: '/login' });
    }
  };

  const handleBackToLogin = () => {
    navigate({ to: '/login' });
  };

  return (
    <ResetPasswordForm
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      onBackToLogin={handleBackToLogin}
    />
  );
}
