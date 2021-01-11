import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { LocalStorageReturn } from './types';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): LocalStorageReturn<T> {
  if (!key) {
    throw new Error('useLocalStorage key may not be falsy');
  }

  const [state, setState] = useState<T | undefined>(() => {
    try {
      const localStorageValue = localStorage.getItem(key);
      if (localStorageValue !== null) {
        return JSON.parse(localStorageValue);
      } else {
        initialValue &&
          localStorage.setItem(
            key,
            typeof initialValue === 'string'
              ? initialValue
              : JSON.stringify(initialValue),
          );
        return initialValue;
      }
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw.
      return initialValue;
    }
  });

  const set: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (valOrFunc) => {
      try {
        const newState =
          typeof valOrFunc === 'function'
            ? (valOrFunc as (state: T) => T)(state)
            : valOrFunc;
        if (typeof newState === 'undefined') return;
        let value: string;

        if (typeof newState === 'string') value = newState;
        else value = JSON.stringify(newState);
        console.log(value);
        localStorage.setItem(key, value);
        setState(JSON.parse(value));
      } catch {
        // If user is in private mode or has storage restriction
        // localStorage can throw.
      }
    },
    [key, setState],
  );

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setState(undefined);
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw.
    }
  }, [key, setState]);

  return [state, set, remove];
}
