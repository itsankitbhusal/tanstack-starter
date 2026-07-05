import { Outlet, createFileRoute } from '@tanstack/react-router';

import { AuthLayout } from '@/components/auth/index';

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
