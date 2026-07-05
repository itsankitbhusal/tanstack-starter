import { createFileRoute } from '@tanstack/react-router';

import { ErrorPage } from '@/components/error-page';

export const Route = createFileRoute('/_public/not-found')({
  component: NotFoundPage,
});

function NotFoundPage() {
  return <ErrorPage errorCode={404} />;
}
