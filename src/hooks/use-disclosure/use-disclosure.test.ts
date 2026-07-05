import { renderHook, act } from '@testing-library/react';
import { useDisclosure } from './index';

describe('useDisclosure', () => {
  it('should initialize with false by default', () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it('should initialize with provided default value', () => {
    const { result } = renderHook(() => useDisclosure({ defaultIsOpen: true }));
    expect(result.current.isOpen).toBe(true);
  });

  it('should open', () => {
    const { result } = renderHook(() => useDisclosure({ defaultIsOpen: false }));
    
    act(() => {
      result.current.onOpen();
    });
    
    expect(result.current.isOpen).toBe(true);
  });

  it('should close', () => {
    const { result } = renderHook(() => useDisclosure({ defaultIsOpen: true }));
    
    act(() => {
      result.current.onClose();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle', () => {
    const { result } = renderHook(() => useDisclosure({ defaultIsOpen: false }));
    
    act(() => {
      result.current.onToggle();
    });
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.onToggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should call onOpen callback when opening', () => {
    const onOpen = vi.fn();
    const { result } = renderHook(() => useDisclosure({ defaultIsOpen: false, onOpen }));
    
    act(() => {
      result.current.onOpen();
    });
    
    expect(onOpen).toHaveBeenCalled();
  });

  it('should call onClose callback when closing', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useDisclosure({ defaultIsOpen: true, onClose }));
    
    act(() => {
      result.current.onClose();
    });
    
    expect(onClose).toHaveBeenCalled();
  });
});
