import {
  dayjs,
  APP_TIMEZONE,
  APP_DATE_FORMAT,
  APP_DATETIME_FORMAT,
  APP_TIME_FORMAT,
} from '@/config/index';

export const DATE_FORMAT = APP_DATE_FORMAT;

export const formatDate = (
  date: Date | string | number | undefined,
): string => {
  if (!date) return '';
  const d = dayjs(date);
  if (!d.isValid()) return '';
  return d.format(APP_DATE_FORMAT);
};

export const getDateRange = (period: string = 'today') => {
  const today = dayjs().tz(APP_TIMEZONE);

  switch (period) {
    case 'today':
      return {
        fromDate: today.format(APP_DATE_FORMAT),
        toDate: today.format(APP_DATE_FORMAT),
      };
    case 'week': {
      const weekStart = today.startOf('week');
      return {
        fromDate: weekStart.format(APP_DATE_FORMAT),
        toDate: today.format(APP_DATE_FORMAT),
      };
    }
    case 'month': {
      const monthStart = today.startOf('month');
      return {
        fromDate: monthStart.format(APP_DATE_FORMAT),
        toDate: today.format(APP_DATE_FORMAT),
      };
    }
    case 'year': {
      const yearStart = today.startOf('year');
      return {
        fromDate: yearStart.format(APP_DATE_FORMAT),
        toDate: today.format(APP_DATE_FORMAT),
      };
    }
    default:
      return {
        fromDate: today.format(APP_DATE_FORMAT),
        toDate: today.format(APP_DATE_FORMAT),
      };
  }
};

export const isToday = (date: Date | string): boolean => dayjs(date).tz(APP_TIMEZONE).isSame(dayjs().tz(APP_TIMEZONE), 'day');

export const formatDateTime = (
  date: Date | string | number | undefined,
): string => {
  if (!date) return '';
  const d = dayjs(date).tz(APP_TIMEZONE);
  if (!d.isValid()) return '';
  return d.format(APP_DATETIME_FORMAT);
};

export const formatTime = (
  date: Date | string | number | undefined,
): string => {
  if (!date) return '';
  const d = dayjs(date).tz(APP_TIMEZONE);
  if (!d.isValid()) return '';
  return d.format(APP_TIME_FORMAT);
};

export const daysBetween = (
  date1: Date | string,
  date2: Date | string,
): number => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);
  return Math.abs(d2.diff(d1, 'day'));
};

export const startOfDay = (date: Date | string | number): Date => dayjs(date).startOf('day').toDate();

export const endOfDay = (date: Date | string | number): Date => dayjs(date).endOf('day').toDate();

export const formatDateFilterValue = (
  value: Date | string | number | undefined,
): string => {
  if (!value) return '';
  return dayjs(value).startOf('day').format(APP_DATE_FORMAT);
};

export const formatDateParam = (
  value: Date | string | number | undefined,
): string | undefined => {
  if (!value) return undefined;
  return dayjs(value).startOf('day').format(APP_DATE_FORMAT);
};

export const toISOStringStartOfDay = (
  value: Date | string | number,
): string => dayjs(value).tz(APP_TIMEZONE).startOf('day').toISOString();

export const toISOStringEndOfDay = (
  value: Date | string | number,
): string => dayjs(value).tz(APP_TIMEZONE).endOf('day').toISOString();
