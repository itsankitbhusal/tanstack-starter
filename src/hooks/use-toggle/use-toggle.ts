import { useCallback, useState } from 'react';

export const useToggle = (initial = false): [boolean, (value?: boolean) => void] => {
  const [isOpen, setIsOpen] = useState(initial);
  const toggle = useCallback((value?: boolean) => setIsOpen(value ?? ((prev) => !prev)), []);

  return [isOpen, toggle];
};
