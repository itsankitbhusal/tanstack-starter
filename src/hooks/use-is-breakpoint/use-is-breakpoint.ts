import { useEffect, useState } from 'react';

type BreakpointMode = 'min' | 'max'

function getInitialMatch(mode: BreakpointMode, breakpoint: number): boolean {
  if (typeof window === 'undefined') return false;
  const query =
    mode === 'min'
      ? `(min-width: ${breakpoint}px)`
      : `(max-width: ${breakpoint - 1}px)`;
  return window.matchMedia(query).matches;
}

export function useIsBreakpoint(
  mode: BreakpointMode = 'max',
  breakpoint = 768,
) {
  const [matches, setMatches] = useState<boolean>(() => getInitialMatch(mode, breakpoint));

  useEffect(() => {
    const query =
      mode === 'min'
        ? `(min-width: ${breakpoint}px)`
        : `(max-width: ${breakpoint - 1}px)`;

    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [mode, breakpoint]);

  return matches;
}
