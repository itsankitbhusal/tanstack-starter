import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const APP_TIMEZONE = 'Asia/Kolkata';

export const APP_DATE_FORMAT = 'YYYY-MM-DD';
export const APP_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const APP_TIME_FORMAT = 'HH:mm';
export const APP_DATE_DISPLAY_FORMAT = 'DD/MM/YYYY';
export const APP_DATETIME_DISPLAY_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const APP_SCHEDULED_DATETIME_FORMAT = 'MMM D, YYYY h:mm A z';
export const APP_MEMBER_SINCE_FORMAT = 'MMM YYYY';
export const APP_LOCALE = 'en-US';

export { dayjs };
