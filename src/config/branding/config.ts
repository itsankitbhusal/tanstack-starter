import logoFull from '@/assets/Logo-full.png?url';
import logoIcon from '@/assets/Logo.png?url';

export const BRAND = {
  name: 'My App',
  adminTitle: 'My App Admin',
  fallbackUserName: 'User',
  containerPrefix: 'my_app',
  logoFull,
  logoIcon,
} as const;

export type BrandConfig = typeof BRAND;
