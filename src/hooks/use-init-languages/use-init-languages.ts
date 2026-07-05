import { useMemo } from 'react';

import {
  getDefaultLanguageCode,
  resolveLanguages,
} from '@/utils/multilang.utils';

interface User {
  languages?: unknown[]
}

export const useInitLanguages = (user: User | null) => {
  const hasInitLanguages =
    Array.isArray(user?.languages) &&
    ((user?.languages?.length ?? 0) > 0);

  const languages = useMemo(() => resolveLanguages(user?.languages), [user]);

  const defaultLanguageCode = useMemo(() => getDefaultLanguageCode(languages), [languages]);

  return { languages, defaultLanguageCode, hasInitLanguages };
};
