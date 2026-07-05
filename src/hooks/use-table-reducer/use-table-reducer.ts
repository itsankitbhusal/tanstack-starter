import { useReducer, useEffect, useMemo, useRef, useCallback, useState } from 'react';
import type { PaginationState } from '@tanstack/react-table';

import { useDebounce } from './useDebounce';
import { getDateRange } from '@/utils/date.utils';

export interface TableState<TFilters = unknown> {
  selectedStatus: string
  appliedFilters: TFilters | null
  rowSelection: Record<string, boolean>
  pagination: PaginationState
  dateRange: { fromDate: string; toDate: string }
  filterOpen: boolean
  newUser: boolean
  searchValue: string
}

export type TableAction<TFilters = unknown> =
  | { type: 'SET_STATUS'; payload: string }
  | { type: 'APPLY_FILTERS'; payload: TFilters }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_ROW_SELECTION'; payload: Record<string, boolean> }
  | { type: 'SET_PAGINATION'; payload: PaginationState }
  | { type: 'UPDATE_DATE_RANGE'; payload: { fromDate: string; toDate: string } }
  | { type: 'TOGGLE_FILTER_OPEN' }
  | { type: 'CLEAR_ROW_SELECTION' }
  | { type: 'SET_NEW_USER'; payload: boolean }
  | { type: 'SET_SEARCH_VALUE'; payload: string }
  | {
      type: 'SYNC_URL_STATE'
      payload: Partial<
        Pick<
          TableState<TFilters>,
          'appliedFilters' | 'pagination' | 'searchValue' | 'selectedStatus'
        >
      >
    }

export function createTableReducer<TFilters = unknown>() {
  return (
    state: TableState<TFilters>,
    action: TableAction<TFilters>,
  ): TableState<TFilters> => {
    switch (action.type) {
      case 'SET_STATUS':
        return { ...state, selectedStatus: action.payload };

      case 'APPLY_FILTERS':
        return {
          ...state,
          appliedFilters: action.payload,
          filterOpen: false,
          pagination: { ...state.pagination, pageIndex: 0 },
        };

      case 'RESET_FILTERS':
        return {
          ...state,
          appliedFilters: null,
          pagination: { ...state.pagination, pageIndex: 0 },
        };

      case 'SET_ROW_SELECTION':
        return { ...state, rowSelection: action.payload };

      case 'CLEAR_ROW_SELECTION':
        return { ...state, rowSelection: {} };

      case 'SET_PAGINATION':
        return { ...state, pagination: action.payload };

      case 'UPDATE_DATE_RANGE':
        return {
          ...state,
          dateRange: action.payload,
          pagination: { ...state.pagination, pageIndex: 0 },
        };

      case 'TOGGLE_FILTER_OPEN':
        return { ...state, filterOpen: !state.filterOpen };

      case 'SET_NEW_USER':
        return { ...state, newUser: action.payload };

      case 'SET_SEARCH_VALUE':
        return {
          ...state,
          searchValue: action.payload,
          pagination: { ...state.pagination, pageIndex: 0 },
        };

      case 'SYNC_URL_STATE':
        return {
          ...state,
          ...action.payload,
        };

      default:
        return state;
    }
  };
}

export interface UseTableReducerOptions<TFilters = unknown> {
  initialStatus?: string
  initialPagination?: PaginationState
  initialDateRange?: { fromDate: string; toDate: string }
  initialFilters?: TFilters | null
  period?: string
  status?: string
  newUser?: boolean
  initialSearchValue?: string
  debounceDelay?: number
  urlSync?: {
    enabled?: boolean
    pageParam?: string
    sizeParam?: string
    searchParam?: string
    includeSearch?: boolean
    statusParam?: string
    filterKeys?: string[]
    includeStatus?: boolean
  }
}

const isEmptyUrlValue = (value: unknown) =>
  value === undefined || value === null || value === '' || value === 'all';

const parseUrlValue = (value: string, defaultValue: unknown) => {
  if (typeof defaultValue === 'number') return Number(value);
  if (typeof defaultValue === 'boolean') return value === 'true';
  return value;
};

const parsePageIndex = (value: string | null) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return 0;
  return parsed - 1;
};

const parsePageSize = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
};

function useUrlSearchParams(
  options: { enabled?: boolean } = {},
) {
  const { enabled = false } = options;
  const [searchParams, setSearchParamsState] = useState(() =>
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams(),
  );

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handlePopState = () => {
      setSearchParamsState(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [enabled]);

  const setSearchParams = useCallback(
    (updates: Record<string, string | number | null | undefined>, replace = false) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      if (enabled && typeof window !== 'undefined') {
        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        if (replace) {
          window.history.replaceState({}, '', newUrl);
        } else {
          window.history.pushState({}, '', newUrl);
        }
      }

      setSearchParamsState(params);
    },
    [enabled, searchParams],
  );

  return { searchParams, setSearchParams };
}

export function useTableReducer<TFilters = unknown>(
  options: UseTableReducerOptions<TFilters> = {},
) {
  const {
    initialStatus = '',
    initialPagination = { pageIndex: 0, pageSize: 10 },
    initialDateRange = getDateRange(options.period || 'today'),
    initialFilters = null,
    period,
    status,
    newUser = false,
    initialSearchValue = '',
    debounceDelay = 500,
    urlSync,
  } = options;

  const reducer = createTableReducer<TFilters>();
  const shouldSyncUrl = urlSync?.enabled ?? false;
  const { searchParams, setSearchParams: setUrlSearchParams } = useUrlSearchParams({
    enabled: shouldSyncUrl,
  });

  const lastUrlRef = useRef(searchParams.toString());
  const skipNextUrlWriteRef = useRef(false);
  const didMountPeriodRef = useRef(false);
  const pageParam = urlSync?.pageParam || 'page';
  const sizeParam = urlSync?.sizeParam || 'size';
  const searchParam = urlSync?.searchParam || 'search';
  const includeSearch = urlSync?.includeSearch ?? true;
  const statusParam = urlSync?.statusParam || 'status';
  const includeStatus = urlSync?.includeStatus ?? true;
  const filterKeys = urlSync?.filterKeys || [];

  const urlPagination = useMemo(
    () =>
      shouldSyncUrl
        ? {
            pageIndex: parsePageIndex(searchParams.get(pageParam)),
            pageSize: parsePageSize(
              searchParams.get(sizeParam),
              initialPagination.pageSize,
            ),
          }
        : initialPagination,
    [initialPagination, pageParam, searchParams, shouldSyncUrl, sizeParam, filterKeys],
  );

  const urlFilters = useMemo(() => {
    if (!shouldSyncUrl) return initialFilters;

    const nextFilters = (initialFilters
      ? { ...initialFilters }
      : {}) as Record<string, unknown>;
    const keys = filterKeys.length ? filterKeys : Object.keys(nextFilters);
    let hasUrlFilters = false;

    if (!keys.length) return initialFilters;

    keys.forEach((key) => {
      const urlValue = searchParams.get(key);
      if (urlValue === null) return;

      hasUrlFilters = true;
      const defaultValue = nextFilters[key];
      nextFilters[key] =
        defaultValue === undefined
          ? urlValue
          : parseUrlValue(urlValue, defaultValue);
    });

    if (!initialFilters && !hasUrlFilters) return null;

    return nextFilters as TFilters;
  }, [initialFilters, searchParams, shouldSyncUrl, filterKeys]);

  const urlSearchValue =
    shouldSyncUrl && includeSearch
      ? searchParams.get(searchParam) || initialSearchValue
      : initialSearchValue;

  const urlStatus =
    shouldSyncUrl && includeStatus
      ? searchParams.get(statusParam) || status || initialStatus
      : status || initialStatus;

  const [state, dispatch] = useReducer(reducer, {
    selectedStatus: urlStatus,
    appliedFilters: urlFilters,
    rowSelection: {},
    pagination: urlPagination,
    dateRange: initialDateRange,
    filterOpen: false,
    newUser,
    searchValue: urlSearchValue,
  });

  const debouncedSearch = useDebounce(state.searchValue, debounceDelay);

  useEffect(() => {
    if (status !== undefined && !shouldSyncUrl) {
      dispatch({ type: 'SET_STATUS', payload: status });
    }
  }, [shouldSyncUrl, status]);

  useEffect(() => {
    if (newUser !== undefined) {
      dispatch({ type: 'SET_NEW_USER', payload: newUser });
    }
  }, [newUser]);

  useEffect(() => {
    if (!shouldSyncUrl) return;

    const currentUrl = searchParams.toString();
    if (currentUrl === lastUrlRef.current) return;

    lastUrlRef.current = currentUrl;
    skipNextUrlWriteRef.current = true;

    dispatch({
      type: 'SYNC_URL_STATE',
      payload: {
        appliedFilters: urlFilters,
        pagination: urlPagination,
        searchValue: urlSearchValue,
        selectedStatus: urlStatus,
      },
    });
  }, [
    searchParams,
    shouldSyncUrl,
    urlFilters,
    urlPagination,
    urlSearchValue,
    urlStatus,
  ]);

  useEffect(() => {
    if (!shouldSyncUrl) return;

    if (skipNextUrlWriteRef.current) {
      skipNextUrlWriteRef.current = false;
      return;
    }

    const updates: Record<string, string | number | null> = {};

    updates[pageParam] = state.pagination.pageIndex + 1;
    updates[sizeParam] = state.pagination.pageSize;

    if (includeSearch) {
      updates[searchParam] = debouncedSearch || null;
    }

    if (includeStatus && !isEmptyUrlValue(state.selectedStatus)) {
      updates[statusParam] = state.selectedStatus;
    } else {
      updates[statusParam] = null;
    }

    const filters = (state.appliedFilters || {}) as Record<string, unknown>;
    const keys = filterKeys.length ? filterKeys : Object.keys(filters);

    keys.forEach((key) => {
      const value = filters[key];

      if (
        isEmptyUrlValue(value) ||
        (typeof value === 'object' && value !== null)
      ) {
        updates[key] = null;
        return;
      }

      updates[key] = String(value);
    });

    setUrlSearchParams(updates, true);
  }, [
    includeStatus,
    includeSearch,
    pageParam,
    searchParam,
    shouldSyncUrl,
    sizeParam,
    state.appliedFilters,
    state.pagination.pageIndex,
    state.pagination.pageSize,
    debouncedSearch,
    state.selectedStatus,
    statusParam,
    filterKeys,
    setUrlSearchParams,
  ]);

  useEffect(() => {
    if (!didMountPeriodRef.current) {
      didMountPeriodRef.current = true;
      return;
    }

    if (period !== undefined) {
      const newDateRange = getDateRange(period);
      dispatch({ type: 'UPDATE_DATE_RANGE', payload: newDateRange });
    }
  }, [period]);

  const actions = useMemo(
    () => ({
      setStatus: (status: string) =>
        dispatch({ type: 'SET_STATUS', payload: status }),
      applyFilters: (filters: TFilters) =>
        dispatch({ type: 'APPLY_FILTERS', payload: filters }),
      resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
      setRowSelection: (selection: Record<string, boolean>) =>
        dispatch({ type: 'SET_ROW_SELECTION', payload: selection }),
      clearRowSelection: () => dispatch({ type: 'CLEAR_ROW_SELECTION' }),
      setPagination: (pagination: PaginationState) =>
        dispatch({ type: 'SET_PAGINATION', payload: pagination }),
      updateDateRange: (dateRange: { fromDate: string; toDate: string }) =>
        dispatch({ type: 'UPDATE_DATE_RANGE', payload: dateRange }),
      toggleFilterOpen: () => dispatch({ type: 'TOGGLE_FILTER_OPEN' }),
      setNewUser: (newUser: boolean) =>
        dispatch({ type: 'SET_NEW_USER', payload: newUser }),
      setSearchValue: (value: string) =>
        dispatch({ type: 'SET_SEARCH_VALUE', payload: value }),
    }),
    [dispatch],
  );

  return { state, dispatch, actions, debouncedSearch };
}
