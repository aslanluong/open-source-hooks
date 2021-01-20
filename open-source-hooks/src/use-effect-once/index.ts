import { useEffect, EffectCallback } from 'react';

export function useEffectOnce(effect: EffectCallback): void {
  return useEffect(effect, []);
}
