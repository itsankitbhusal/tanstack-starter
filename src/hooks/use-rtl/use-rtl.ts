import { useEffect, useState } from 'react';

function getInitialRTL(): boolean {
  if (typeof document === 'undefined') return false;
  const html = document.documentElement;
  const direction = html.getAttribute('dir') || html.getAttribute('direction');
  return direction === 'rtl';
}

export const useRTL = (): boolean => {
  const [isRTL, setIsRTL] = useState(getInitialRTL);

  useEffect(() => {
    const html = document.documentElement;
    const checkRTL = () => {
      const direction = html.getAttribute('dir') || html.getAttribute('direction');
      setIsRTL(direction === 'rtl');
    };

    checkRTL();

    const observer = new MutationObserver(checkRTL);
    observer.observe(html, { attributes: true, attributeFilter: ['dir', 'direction'] });

    return () => observer.disconnect();
  }, []);

  return isRTL;
};
