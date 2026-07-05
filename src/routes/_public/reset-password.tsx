import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';

import { ResetPasswordForm } from '@/features/auth/components/index';

export const Route = createFileRoute('/_public/reset-password')({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();

  const handleSubmit = async (newPassword: string, confirmPassword: string) => {
    console.log('Reset password:', { newPassword, confirmPassword });
    toast.success('Password reset successfully!');
    navigate({ to: '/login' });
  };

  const handleBackToLogin = () => {
    navigate({ to: '/login' });
  };

  return (
    <ResetPasswordForm
      onSubmit={handleSubmit}
      isSubmitting={false}
      onBackToLogin={handleBackToLogin}
    />
  );
}