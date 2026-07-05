import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/dashboard/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dashboard</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <p className="text-3xl font-bold">$12,345</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Orders</h3>
          <p className="text-3xl font-bold">567</p>
        </div>
      </div>
    </div>
  );
}
