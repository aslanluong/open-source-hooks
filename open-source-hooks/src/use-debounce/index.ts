import { useState, useRef, useEffect } from 'react';
import { DebouncedReturn } from './types';

export function useDebounce<T>(value: T, delay: number): DebouncedReturn<T> {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const handler = useRef<NodeJS.Timeout | undefined>(undefined);

  const forceInstant = () => {
    if (handler.current) {
      clearTimeout(handler.current);
    }
    setDebouncedValue(value);
  };

  useEffect(() => {
    // Update debounced value after delay
    handler.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      if (handler.current) {
        clearTimeout(handler.current);
      }
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return { debouncedValue, forceInstant };
}
