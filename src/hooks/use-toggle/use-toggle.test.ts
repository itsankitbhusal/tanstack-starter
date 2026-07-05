import { renderHook, act } from '@testing-library/react';
import { useToggle } from './index';

describe('useToggle', () => {
  it('should initialize with default value (false)', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('should initialize with provided initial value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('should toggle from false to true', () => {
    const { result } = renderHook(() => useToggle(false));
    
    act(() => {
      result.current[1]();
    });
    
    expect(result.current[0]).toBe(true);
  });

  it('should toggle from true to false', () => {
    const { result } = renderHook(() => useToggle(true));
    
    act(() => {
      result.current[1]();
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('should set to specific value', () => {
    const { result } = renderHook(() => useToggle(false));
    
    act(() => {
      result.current[1](true);
    });
    
    expect(result.current[0]).toBe(true);
  });
});
