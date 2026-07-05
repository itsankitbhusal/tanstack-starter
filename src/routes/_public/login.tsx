import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';

import { LoginForm } from '@/features/auth/components/index';
import { type LoginFormValues } from '@/lib/schemas/index';

export const Route = createFileRoute('/_public/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: LoginFormValues) => {
    console.log('Login data:', data);
    toast.success('Login successful!');
    navigate({ to: '/dashboard' });
  };

  const handleForgotPassword = () => {
    navigate({ to: '/forgot-password' });
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      isSubmitting={false}
      onForgotPassword={handleForgotPassword}
    />
  );
}
