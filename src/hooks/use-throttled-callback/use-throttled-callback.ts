import throttle from 'lodash.throttle';

import { useUnmount } from './useUnmount';
import { useMemo } from 'react';

interface ThrottleSettings {
  leading?: boolean | undefined
  trailing?: boolean | undefined
}

const defaultOptions: ThrottleSettings = {
  leading: false,
  trailing: true,
};

export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait = 250,
  options: ThrottleSettings = defaultOptions,
): {
  (this: unknown, ...args: Parameters<T>): ReturnType<T>
  cancel: () => void
  flush: () => void
} {
  const handler = useMemo(
    () => throttle<T>(fn, wait, options),
    [fn, wait, options],
  );

  useUnmount(() => {
    handler.cancel();
  });

  return handler;
}

export default useThrottledCallback;
