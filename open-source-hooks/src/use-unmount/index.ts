import { useRef } from 'react';
import { useEffectOnce } from '../index';

export function useUnmount(
  callback: () => void | (() => void | undefined),
): void {
  const callbackRef = useRef(callback);

  // newest callback will be invoked
  callbackRef.current = callback;

  return useEffectOnce(() => callbackRef.current);
}
