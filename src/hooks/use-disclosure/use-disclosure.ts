import { useCallback, useState } from 'react';

export interface UseDisclosureProps {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (isOpen: boolean) => void;
}

export interface UseDisclosureReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useDisclosure(
  props: UseDisclosureProps = {},
): UseDisclosureReturn {
  const {
    isOpen: isOpenProp,
    defaultIsOpen = false,
    onOpen,
    onClose,
    onChange,
  } = props;

  const isControlled = typeof isOpenProp === 'boolean';

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultIsOpen);

  const isOpen = isControlled ? isOpenProp : uncontrolledOpen;

  const setIsOpen = useCallback(
    (value: React.SetStateAction<boolean>) => {
      const next =
        typeof value === 'function'
          ? (value as (prev: boolean) => boolean)(isOpen)
          : value;

      if (!isControlled) {
        setUncontrolledOpen(next);
      }

      onChange?.(next);

      if (next) onOpen?.();
      else onClose?.();
    },
    [isControlled, isOpen, onChange, onOpen, onClose],
  );

  const onOpenHandler = useCallback(() => setIsOpen(true), [setIsOpen]);
  const onCloseHandler = useCallback(() => setIsOpen(false), [setIsOpen]);
  const onToggle = useCallback(() => setIsOpen((v) => !v), [setIsOpen]);

  return {
    isOpen,
    onOpen: onOpenHandler,
    onClose: onCloseHandler,
    onToggle,
    setIsOpen,
  };
}
