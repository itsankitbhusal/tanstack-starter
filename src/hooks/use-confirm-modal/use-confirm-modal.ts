import { useState, useEffect, useCallback } from 'react';

export interface ModalState {
  open: boolean
  title: string
  description: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  onConfirm: () => void
  autoClose?: boolean
  autoCloseDelay?: number
  onSuccessComplete?: () => void
}

export interface UseConfirmModalConfig {
  autoClose?: boolean
  autoCloseDelay?: number
}

export const useConfirmModal = (config: UseConfirmModalConfig = {}) => {
  const {
    autoClose: defaultAutoClose = true,
    autoCloseDelay: defaultDelay = 1200,
  } = config;

  const [state, setState] = useState<ModalState>({
    open: false,
    title: '',
    description: '',
    variant: 'default',
    onConfirm: () => {},
    autoClose: defaultAutoClose,
    autoCloseDelay: defaultDelay,
  });

  const closeModal = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const showConfirm = useCallback((config: Omit<ModalState, 'open'>) => {
    setState((prev) => ({
      ...prev,
      ...config,
      open: true,
      isSuccess: false,
      isError: false,
      errorMessage: undefined,
      onSuccessComplete: undefined,
    }));
  }, []);

  const showSuccess = useCallback(
    (
      description?: string,
      title?: string,
      config?: {
        autoClose?: boolean
        autoCloseDelay?: number
        onComplete?: () => void
      },
    ) => {
      setState((prev) => ({
        ...prev,
        isSuccess: true,
        isError: false,
        ...(description && { description }),
        ...(title && { title }),
        ...(config && {
          autoClose: config.autoClose ?? prev.autoClose,
          autoCloseDelay: config.autoCloseDelay ?? prev.autoCloseDelay,
          onSuccessComplete: config.onComplete,
        }),
      }));
    },
    [],
  );

  const showError = useCallback((errorMessage: string, title?: string) => {
    setState((prev) => ({
      ...prev,
      isError: true,
      isSuccess: false,
      errorMessage,
      ...(title && { title }),
    }));
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, open }));
  }, []);

  useEffect(() => {
    if (state.open && state.isSuccess && state.autoClose) {
      const timer = setTimeout(() => {
        closeModal();
        if (state.onSuccessComplete) {
          state.onSuccessComplete();
        }
      }, state.autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [
    state,
    closeModal,
  ]);

  return {
    state,
    setState,
    showConfirm,
    showSuccess,
    showError,
    closeModal,
    onOpenChange,
  };
};
