import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';

export const Route = createFileRoute('/_public/email-sent')({
  component: EmailSentPage,
});

function EmailSentPage() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate({ to: '/login' });
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      <h1 className="text-2xl font-semibold">Check your email</h1>
      <p className="text-muted-foreground">
        We have sent a password reset link to your email address.
        Please check your inbox and follow the instructions to reset your password.
      </p>
      <button
        onClick={handleBackToLogin}
        className="mt-4 text-sm text-primary hover:underline"
      >
        Back to Login
      </button>
    </div>
  );
}
