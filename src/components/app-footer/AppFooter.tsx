import { Monitor, Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/utils/index';
import { useTheme } from '@/contexts/ThemeContext';
import { t } from '@/i18n/i18n';

type ThemeOption = {
  value: 'light' | 'dark' | 'system'
  label: string
  icon: typeof Sun
}

const options: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export function AppFooter() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="flex shrink-0 items-center justify-between border-t bg-card px-4 py-2 text-xs">
      <div className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <span className="text-[10px] font-bold">H</span>
        </div>
        <div className="leading-tight">
          <p>
            <span className="font-semibold text-destructive">
              {t('footer.stagingLabel')}
            </span>{' '}
            <span className="text-muted-foreground">
              {t('footer.version')}: staging-1fb66ac31 staging-f5f7a39
            </span>
          </p>
          <p className="text-muted-foreground">
            {t('footer.poweredBy')} {t('footer.copyright')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex items-center">
          {options.map(({ value, label, icon: Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                type="button"
                aria-label={`${label} theme`}
                title={label}
                onClick={() => setTheme(value)}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                  active
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-4" />
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
