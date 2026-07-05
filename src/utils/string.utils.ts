export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const prettifyKey = (key: string): string => {
  if (!key) return '';

  return key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\b\w/g, (s) => s.toUpperCase())
    .trim();
};

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toKebabCase = (str: string): string => {
  if (!str) return '';
  return (
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
      )
      ?.map((x) => x.toLowerCase())
      .join('-') || str.toLowerCase()
  );
};

export const toSnakeCase = (str: string): string => {
  if (!str) return '';
  return (
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
      )
      ?.map((x) => x.toLowerCase())
      .join('_') || str.toLowerCase()
  );
};

export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `**@${domain}`;
  return `${user.slice(0, 2)}***${user.slice(-1)}@${domain}`;
};

export const maskSensitive = (str: string, lastVisible = 4): string => {
  if (!str || str.length <= lastVisible) return str;
  const visible = str.slice(-lastVisible);
  const mask = '*'.repeat(str.length - lastVisible);
  return `${mask}${visible}`;
};

export const truncate = (str: string, length = 20): string => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export const stringTrimmer = (val: string, check = ''): string => {
  let result = val;

  if (result.endsWith(check)) {
    result = result.slice(0, -check.length);
  }

  if (result.startsWith(check)) {
    result = result.slice(check.length);
  }

  return result;
};
