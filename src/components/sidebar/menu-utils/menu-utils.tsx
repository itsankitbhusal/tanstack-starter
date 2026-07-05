import { useCallback, useMemo } from 'react';

import type { MenuItem, MenuSection } from './NavMenus';

export function isMenuItemActive(item: MenuItem, pathname: string): boolean {
  return !!(
    item.path &&
    (pathname === item.path || pathname.startsWith(`${item.path}/`))
  );
}

export function useIsMenuItemActive(pathname: string) {
  return useCallback(
    (item: MenuItem) => isMenuItemActive(item, pathname),
    [pathname],
  );
}

export function usePrefixedMenuConfig(
  config: MenuSection[],
  prefix: string,
  id: string,
): MenuSection[] {
  return useMemo(
    () =>
      config.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          path: `${prefix.replace(/\/$/, '')}/${item.path?.replace(/^\//, '')}/${id}`,
        })),
      })),
    [config, prefix, id],
  );
}
