import { useRef, useEffect } from 'react';

export function useUnmount(
  callback: () => void | (() => void | undefined),
): void {
  const callbackRef = useRef(callback);

  // newest callback will be invoked
  callbackRef.current = callback;

  return useEffect(() => callbackRef.current, []);
}
