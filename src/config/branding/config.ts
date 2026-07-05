import logoFull from '@/assets/Logo-full.png?url';
import logoIcon from '@/assets/Logo.png?url';

export const BRAND = {
  name: 'PayNow',
  adminTitle: 'PayNow Admin',
  fallbackUserName: 'User',
  containerPrefix: 'my_app',
  logoFull,
  logoIcon,
  tagline: 'Paynow Backoffice',
  description: 'Monitor and control business operations including accounts, merchants, outlets, terminals, products and invoices.',
  poweredBy: 'Modern, Secured, and Reliable Payment Gateway, powered by:',
  gatewayName: 'cybersource',
  gatewaySub: 'A Visa Solution',
  gatewayType: 'gateway',
} as const;

export type BrandConfig = typeof BRAND;
