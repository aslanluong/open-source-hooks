import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

export function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList,
): void {
  const isFirst = useRef(true);

  return useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    return effect();
  }, deps);
}
