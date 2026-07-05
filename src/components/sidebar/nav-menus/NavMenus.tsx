import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/sidebar/index';

export interface MenuItem {
  label?: string;
  labelAr?: string;
  icon?: ReactNode;
  path?: string;
  search?: Record<string, string | undefined>;
  children?: MenuItem[];
}

export interface MenuSection {
  sectionTitle?: string;
  sectionTitleAr?: string;
  items: MenuItem[];
}

export interface NavMenuLinkRenderProps {
  item: MenuItem;
  children: ReactNode;
}

export interface NavMenusProps {
  menus?: MenuSection[];
  isMenuItemActive?: (item: MenuItem) => boolean;
  renderMenuItemLink: (props: NavMenuLinkRenderProps) => ReactElement;
  renderSubMenuItemLink?: (props: NavMenuLinkRenderProps) => ReactElement;
}

export function NavMenus({
  menus,
  isMenuItemActive,
  renderMenuItemLink,
  renderSubMenuItemLink,
}: NavMenusProps) {
  const { open } = useSidebar();
  return (
    <>
      {menus?.map((menu) => (
        <SidebarGroup
          className="border-b last:border-b-0 pb-0 group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:pb-0 group-data-[collapsible=icon]:pt-0"
          key={menu.sectionTitle || menu.items.map((i) => i.label).join('-')}
        >
          {menu.sectionTitle && (
            <SidebarGroupLabel>{menu.sectionTitle}</SidebarGroupLabel>
          )}
          <SidebarMenu className="gap-0.5">
            {menu.items.map((item) => {
              const isActive = !!isMenuItemActive?.(item);
              const hasChildren = item.children && item.children.length > 0;

              if (hasChildren) {
                return (
                  <Collapsible
                    key={item.label}
                    asChild
                    defaultOpen={isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className="text-sidebar-foreground"
                          isActive={isActive}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children?.map((child) => {
                            const childActive = !!isMenuItemActive?.(child);
                            return (
                              <SidebarMenuSubItem key={child.label}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={childActive}
                                >
                                  {renderSubMenuItemLink
                                    ? renderSubMenuItemLink({
                                        item: child,
                                        children: <span>{child.label}</span>,
                                      })
                                    : renderMenuItemLink({
                                        item: child,
                                        children: <span>{child.label}</span>,
                                      })}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    {renderMenuItemLink({
                      item,
                      children: (
                        <>
                          {item.icon}
                          {open && <span>{item.label}</span>}
                        </>
                      ),
                    })}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
