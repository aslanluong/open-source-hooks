import { useState, useEffect } from 'react';
import { WindowSize } from './types';

export function useWindowSize(
  initialWidth = window.innerWidth,
  initialHeight = window.innerHeight,
): WindowSize {
  const [state, setState] = useState<WindowSize>({
    width: initialWidth,
    height: initialHeight,
  });

  useEffect(() => {
    const handler = () =>
      setState({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  return state;
}
