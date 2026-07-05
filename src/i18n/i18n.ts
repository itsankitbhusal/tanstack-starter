import en from './locales/en.json';

export type Locale = 'en';

export const locales: Record<Locale, string> = {
  en: 'English',
};

export const defaultLocale: Locale = 'en';

export type TranslationKeys = typeof en;

const translations: Record<Locale, TranslationKeys> = {
  en,
};

export function getTranslation(locale: Locale = defaultLocale): TranslationKeys {
  return translations[locale] || translations[defaultLocale];
}

export function t(
  key: string,
  locale: Locale = defaultLocale,
  params?: Record<string, string | number>,
): string {
  const translation = getTranslation(locale);
  const keys = key.split('.');
  let result: unknown = translation;

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  if (typeof result !== 'string') {
    return key;
  }

  if (params) {
    return result.replace(/\{\{(\w+)\}\}/g, (_, paramKey) =>
      params[paramKey]?.toString() ?? `{{${paramKey}}}`,
    );
  }

  return result;
}
