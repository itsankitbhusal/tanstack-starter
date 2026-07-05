import {
  Boxes,
  CreditCard,
  FileText,
  Handshake,
  KeyRound,
  LayoutPanelLeft,
  Link2,
  ShoppingBag,
  Store,
  Users2,
  UsersRound,
} from 'lucide-react';

import type { MenuSection } from './NavMenus';

export const BUSINESS_MENU_CONFIG: MenuSection[] = [
  {
    items: [
      {
        path: '/dashboard',
        label: 'Dashboard',
        icon: (
          <LayoutPanelLeft className="w-4 h-4 rotate-180" strokeWidth={1.8} />
        ),
      },
    ],
  },
  {
    sectionTitle: 'Operation Management',
    items: [
      {
        path: '/payment-requests',
        label: 'Payment Request',
        icon: <FileText className="w-4 h-4" strokeWidth={1.8} />,
      },
      {
        path: '/quick-links',
        label: 'Quick Link',
        icon: <Link2 className="w-4 h-4" strokeWidth={1.8} />,
      },
    ],
  },
  {
    sectionTitle: 'Business Management',
    items: [
      {
        path: '/products',
        label: 'Products',
        icon: <Boxes className="w-4 h-4" strokeWidth={1.8} />,
      },
      {
        path: '/customers',
        label: 'Customers',
        icon: <UsersRound className="w-4 h-4" strokeWidth={1.8} />,
      },
    ],
  },
  {
    sectionTitle: 'Entities Management',
    items: [
      {
        path: '/merchants',
        label: 'Merchants',
        icon: <ShoppingBag className="w-4 h-4" strokeWidth={1.8} />,
      },
      {
        path: '/outlets',
        label: 'Outlets',
        icon: <Store className="w-4 h-4" strokeWidth={1.8} />,
      },
      {
        path: '/terminals',
        label: 'Terminals',
        icon: <CreditCard className="w-4 h-4" strokeWidth={1.8} />,
      },
      {
        path: '/kyb',
        label: 'Know Your Business',
        icon: <Handshake className="w-4 h-4" strokeWidth={1.8} />,
      },
    ],
  },
  {
    sectionTitle: 'Identity & Access Management',
    items: [
      {
        path: '/identity-management',
        label: 'Identity Management',
        icon: <Users2 className="w-4 h-4" strokeWidth={1.8} />,
      },
      {
        path: '/access-management',
        label: 'Access Management',
        icon: <KeyRound className="w-4 h-4" strokeWidth={1.8} />,
      },
      {
        path: '/merchant-access',
        label: 'Merchant Access',
        icon: <UsersRound className="w-4 h-4" strokeWidth={1.8} />,
      },
    ],
  },
];
