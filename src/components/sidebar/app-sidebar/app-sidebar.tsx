'use client';

import * as React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { NavMenus, type MenuItem, type NavMenuLinkRenderProps } from '@/components/sidebar/nav-menus';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/sidebar/sidebar';

import { NavUser } from '@/components/nav-user';
import { BRAND } from '@/config/branding/config';
import { useLogout } from '@/hooks/use-auth';

interface MenuConfigItem {
  label: string
  path: string
  icon: React.ReactNode
}

interface MenuConfigSection {
  sectionTitle: string
  items: MenuConfigItem[]
}

const MENU_CONFIG: MenuConfigSection[] = [
  {
    sectionTitle: 'Main',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: <span>📊</span> },
      { label: 'Users', path: '/users', icon: <span>👥</span> },
      { label: 'Products', path: '/products', icon: <span>📦</span> },
      { label: 'Settings', path: '/settings', icon: <span>⚙️</span> },
    ],
  },
];

const data = {
  user: {
    name: 'SuperAdmin',
    email: 'm@example.com',
    avatar: '/FFC.png',
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { state: sidebarState } = useSidebar();

  const isMenuItemActive = React.useCallback(
    (item: MenuItem) =>
      !!(
        item.path &&
        (location.pathname === item.path ||
          location.pathname.startsWith(`${item.path}/`))
      ),
    [location.pathname],
  );

  const renderMenuItemLink = React.useCallback(
    ({ item, children }: NavMenuLinkRenderProps) => (
      <Link to={item.path as never} search={item.search as never}>
        {children}
      </Link>
    ),
    [],
  );

  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  const handleProfile = () => {
    window.location.href = '/profile';
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      variant="inset"
      className="bg-sidebar"
    >
      <SidebarHeader className="gap-0">
        <div className="flex items-center justify-start px-3 py-2">
          <img
            src={sidebarState === 'collapsed' ? BRAND.logoIcon : BRAND.logoFull}
            alt="Logo"
            className="object-contain h-8 w-auto py-1"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMenus
          menus={MENU_CONFIG}
          isMenuItemActive={isMenuItemActive}
          renderMenuItemLink={renderMenuItemLink}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={data.user}
          onLogout={handleLogout}
          onProfile={handleProfile}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
