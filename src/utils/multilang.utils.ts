export interface InitLanguage {
  id?: number;
  langCode: string;
  name?: string;
  isDefault?: boolean;
}

const fallbackLanguages: InitLanguage[] = [
  { langCode: 'en', name: 'English', isDefault: true },
  { langCode: 'ar', name: 'Arabic', isDefault: false },
];

const normalizeLanguageCode = (langCode: string) => {
  const normalized = langCode.trim().toLowerCase();
  return normalized === 'kr' || normalized === 'ku' ? 'ar' : normalized;
};

export const resolveLanguages = (languages?: unknown): InitLanguage[] => {
  if (!Array.isArray(languages) || languages.length === 0) {
    return fallbackLanguages;
  }

  const normalized = languages
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const langCode = (item as { langCode?: unknown }).langCode;
      if (typeof langCode !== 'string' || !langCode.trim()) return null;

      return {
        id: (item as { id?: number }).id,
        langCode: normalizeLanguageCode(langCode),
        name: (item as { name?: string }).name,
        isDefault: Boolean((item as { isDefault?: boolean }).isDefault),
      } as InitLanguage;
    })
    .filter((item): item is InitLanguage => Boolean(item));

  const deduped = Array.from(
    normalized.reduce<Map<string, InitLanguage>>((acc, language) => {
      if (!acc.has(language.langCode)) {
        acc.set(language.langCode, language);
      } else if (language.isDefault) {
        const existing = acc.get(language.langCode)!;
        acc.set(language.langCode, { ...existing, isDefault: true });
      }

      return acc;
    }, new Map()),
  ).map(([, value]) => value);

  deduped.sort((a, b) => {
    if (a.isDefault === b.isDefault) return 0;
    return a.isDefault ? -1 : 1;
  });

  return deduped.length ? deduped : fallbackLanguages;
};

export const getDefaultLanguageCode = (languages: InitLanguage[]) => (
    languages.find((language) => language.isDefault)?.langCode ||
    languages[0]?.langCode ||
    'en'
  );

export const buildEmptyMultilangObject = (languages: InitLanguage[]) => languages.reduce<Record<string, string>>((acc, language) => {
    acc[language.langCode] = '';
    return acc;
  }, {});

export const normalizeMultilangValue = (
  value: unknown,
  fallbackValue: string | null | undefined,
  languages: InitLanguage[],
) => {
  const empty = buildEmptyMultilangObject(languages);

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const fromObject = value as Record<string, unknown>;
    const mergedKeys = Array.from(
      new Set([...Object.keys(empty), ...Object.keys(fromObject)]),
    );

    return mergedKeys.reduce<Record<string, string>>(
      (acc, langCode) => {
        const rawValue = fromObject[langCode];
        acc[langCode] = typeof rawValue === 'string' ? rawValue : '';
        return acc;
      },
      { ...empty },
    );
  }

  const defaultLangCode = getDefaultLanguageCode(languages);
  const secondaryLangCode =
    languages.find((language) => language.langCode !== defaultLangCode)
      ?.langCode || defaultLangCode;

  const next = { ...empty };
  if (typeof value === 'string') {
    next[defaultLangCode] = value;
  }
  if (typeof fallbackValue === 'string') {
    next[secondaryLangCode] = fallbackValue;
  }

  return next;
};

export const getMergedLanguages = (
  languages: InitLanguage[],
  value?: Record<string, string>,
) => {
  const merged = new Map<string, InitLanguage>();

  languages.forEach((language) => {
    merged.set(language.langCode, language);
  });

  if (value && typeof value === 'object') {
    Object.keys(value).forEach((langCode) => {
      if (!merged.has(langCode)) {
        merged.set(langCode, {
          langCode,
          name: langCode.toUpperCase(),
          isDefault: false,
        });
      }
    });
  }

  return Array.from(merged.values());
};

export const resolveLocalizedValue = (
  value: string | Record<string, string> | undefined,
  currentLanguageCode: string,
  defaultLanguageCode: string,
) => {
  if (!value) return '';
  if (typeof value === 'string') return value;

  return (
    value[currentLanguageCode] ||
    value[defaultLanguageCode] ||
    value.en ||
    Object.values(value)
      .find((item) => item)
      ?.toString() ||
    ''
  );
};

export const getLanguageLabel = (language: InitLanguage) => language.name?.trim() || language.langCode.toUpperCase();

export const getLocalizedFieldLabel = (
  baseLabel: string,
  language: InitLanguage,
) => {
  const languageLabel = getLanguageLabel(language);
  const normalizedBase = baseLabel.trim().toLowerCase();
  const normalizedLanguage = languageLabel.trim().toLowerCase();

  if (normalizedBase.includes(normalizedLanguage)) {
    return baseLabel;
  }

  return `${baseLabel} (${languageLabel})`;
};
