import { useEffect, useRef, useState } from 'react';

export function useThrottle<T>(value: T, cooldown: number): T {
  const [state, setState] = useState<T>(value);
  const cooldownTimeout = useRef<NodeJS.Timeout>();
  const nextValue = useRef<T>(null);
  const hasNextValue = useRef(false);

  useEffect(() => {
    if (!cooldownTimeout.current) {
      setState(value);
      const timeoutCallback = () => {
        if (hasNextValue.current) {
          hasNextValue.current = false;
          setState(nextValue.current);
          cooldownTimeout.current = setTimeout(timeoutCallback, cooldown);
        } else {
          cooldownTimeout.current = undefined;
        }
      };
      cooldownTimeout.current = setTimeout(timeoutCallback, cooldown);
    } else {
      nextValue.current = value;
      hasNextValue.current = true;
    }
  }, [value]);

  useEffect(() => {
    return () => {
      cooldownTimeout.current && clearTimeout(cooldownTimeout.current);
    };
  }, []);

  return state;
}
