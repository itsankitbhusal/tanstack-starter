import { Bell, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

import { SidebarTrigger } from '@/components/sidebar/index';

export interface NavbarBreadcrumbItem {
  label: string
  path: string
  isActive: boolean
}

export interface NavbarProps {
  breadcrumbs: NavbarBreadcrumbItem[]
  onBreadcrumbClick?: (path: string) => void
  portalName?: string
}

export function Navbar({
  breadcrumbs,
  onBreadcrumbClick,
  portalName,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-30 flex h-12 w-full shrink-0 items-center justify-between border-b bg-card px-2">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-7 w-7" />

        <div className="flex items-center gap-2">
          {portalName && (
            <>
              <span className="text-muted-foreground">|</span>
              <span className="font-semibold text-foreground">
                {portalName}
              </span>
            </>
          )}

          <nav
            className="flex items-center gap-1 text-md"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.length > 0 && portalName && (
              <ChevronRight
                className="w-4 h-4 text-sidebar-foreground"
                strokeWidth={2}
              />
            )}
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <React.Fragment key={`${crumb.path}-${index}`}>
                  {index > 0 && (
                    <ChevronRight
                      className="w-4 h-4 text-sidebar-foreground"
                      strokeWidth={2}
                    />
                  )}
                  {crumb.isActive ? (
                    <span
                      className={cn(
                        'text-foreground',
                        !isLast && 'font-medium',
                      )}
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onBreadcrumbClick?.(crumb.path)}
                      className={cn(
                        'transition-colors text-sidebar-foreground hover:text-primary cursor-pointer',
                        !isLast && 'font-medium',
                      )}
                    >
                      {crumb.label}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-primary/10"
        >
          <Bell className="w-4 h-4 text-sidebar-foreground" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive"></span>
        </button>
      </div>
    </nav>
  );
}
