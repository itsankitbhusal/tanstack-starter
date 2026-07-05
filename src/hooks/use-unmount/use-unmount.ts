import { useEffect } from 'react';

export const useUnmount = (callback: (...args: Array<unknown>) => unknown) => {
  useEffect(() => 
     () => {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  , []);
};

export default useUnmount;
