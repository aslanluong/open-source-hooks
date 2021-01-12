import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { LocalStorageReturn, ParserOptions } from './types';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: ParserOptions<T>,
): LocalStorageReturn<T> {
  if (!key) {
    throw new Error('useLocalStorage key may not be falsy');
  }

  const deserializer = options ? options.deserializer : JSON.parse;
  const serializer = options ? options.serializer : JSON.stringify;

  const [state, setState] = useState<T | undefined>(() => {
    try {
      const localStorageValue = localStorage.getItem(key);
      if (localStorageValue !== null) {
        return deserializer(localStorageValue);
      } else {
        initialValue && localStorage.setItem(key, serializer(initialValue));
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
        const value: string = serializer(newState);

        localStorage.setItem(key, value);
        setState(deserializer(value));
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
