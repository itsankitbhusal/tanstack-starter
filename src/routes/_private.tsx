import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { SidebarProvider, SidebarInset, AppSidebar } from '@/components/sidebar/index';
import { AdminNavbar } from '@/components/navbar/index';
import { AppFooter } from '@/components/app-footer/AppFooter';

export const Route = createFileRoute('/_private')({
  component: PrivateLayout,
});

function PrivateLayout() {
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