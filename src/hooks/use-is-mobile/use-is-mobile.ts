import { useIsBreakpoint } from '@/hooks/use-is-breakpoint';

export function useIsMobile() {
  return useIsBreakpoint('max', 768);
}
