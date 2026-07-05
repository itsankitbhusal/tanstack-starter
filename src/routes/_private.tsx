import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Suspense, useEffect, useState } from 'react';

import { SidebarProvider, SidebarInset, AppSidebar } from '@/components/sidebar/index';
import { AdminNavbar } from '@/components/navbar/index';
import { AppFooter } from '@/components/app-footer/AppFooter';
import { useAuth } from '@/contexts/AuthContext';

export const Route = createFileRoute('/_private')({
  component: PrivateLayout,
});

function PrivateLayout() {
  const { isAuthenticated, isAuthLoading, logout } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      logout();
      return;
    }

    const timer = setTimeout(() => setChecked(true), 0);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isAuthLoading, logout]);

  if (isAuthLoading || !checked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-md font-medium text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <PrivateLayoutShell>
      <Outlet />
    </PrivateLayoutShell>
  );
}

export function PrivateLayoutShell({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="overflow-hidden">
        <AdminNavbar />

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4">
          <Suspense
            fallback={
              <div className="flex min-h-[60vh] items-center justify-center">
                Loading...
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
