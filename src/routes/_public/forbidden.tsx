import { createFileRoute } from '@tanstack/react-router';

import { ErrorPage } from '@/components/error-page';

export const Route = createFileRoute('/_public/forbidden')({
  component: ForbiddenPage,
});

function ForbiddenPage() {
  return <ErrorPage errorCode={403} />;
}
