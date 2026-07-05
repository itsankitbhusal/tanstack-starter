import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';

import { ForgotPasswordForm } from '@/features/auth/components/index';

export const Route = createFileRoute('/_public/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSubmit = async (email: string) => {
    console.log('Forgot password for:', email);
    toast.success('Password reset link sent to your email!');
    navigate({ to: '/email-sent' });
  };

  const handleBackToLogin = () => {
    navigate({ to: '/login' });
  };

  return (
    <ForgotPasswordForm
      onSubmit={handleSubmit}
      isSubmitting={false}
      onBackToLogin={handleBackToLogin}
    />
  );
}
