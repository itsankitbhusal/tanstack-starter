import {
  Boxes,
  CreditCard,
  FileText,
  Handshake,
  LayoutPanelLeft,
  Store,
  UsersRound,
} from 'lucide-react';

import type { MenuSection } from './NavMenus';

export const MERCHANT_MENU_CONFIG: MenuSection[] = [
  {
    items: [
      {
        path: 'dashboard',
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
        path: 'payment-requests',
        label: 'Payment Request',
        icon: <FileText className="w-4 h-4" strokeWidth={1.8} />,
      },
    ],
  },
  {
    sectionTitle: 'Business Management',
    items: [
      {
        path: 'customers',
        label: 'Customers',
        icon: <UsersRound className="w-4 h-4" strokeWidth={1.8} />,
      },
      {
        path: 'products',
        label: 'Products',
        icon: <Boxes className="w-4 h-4" strokeWidth={1.8} />,
      },
    ],
  },
  {
    sectionTitle: 'Entities Management',
    items: [
      {
        path: 'outlets',
        label: 'Outlets',
        icon: <Store className="w-4 h-4" strokeWidth={1.8} />,
      },
      {
        path: 'terminals',
        label: 'Terminals',
        icon: <CreditCard className="w-4 h-4" strokeWidth={1.8} />,
      },
      {
        path: 'kyb',
        label: 'Know Your Business',
        icon: <Handshake className="w-4 h-4" strokeWidth={1.8} />,
      },
    ],
  },
];
