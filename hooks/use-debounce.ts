import { useEffect, useState } from 'react';

const useDebounce = <T = string, >(value: T, delay: number, immediate = false) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      if (immediate) {
        setDebouncedValue(value); // call the timeout anyway the first time
      }
    }, [],
  );

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay],
  );
  return debouncedValue;
};

export default useDebounce;
