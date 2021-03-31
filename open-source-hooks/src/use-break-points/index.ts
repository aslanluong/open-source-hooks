import { useEffect, useState, useMemo } from 'react';
import { BreakpointName, Breakpoints } from './types';

class BreakpointsConfig {
  // Inspired by tailwindcss
  static breakpoints: Breakpoints<BreakpointName> = {
    '2xl': 1536,
    xl: 1280,
    lg: 1024,
    md: 768,
    sm: 640,
  };

  static setBreakpoints<T extends BreakpointName>(breakpoints: Breakpoints<T>): void {
    this.breakpoints = breakpoints;
  }

  static getBreakpoints<T extends BreakpointName>(): Breakpoints<T> {
    return this.breakpoints;
  }
}

/**
 * Breakpoint format is <name (string | number): minWidth (number)>
 */
export function setDefaultBreakpoints<T extends BreakpointName>(breakpoints: Breakpoints<T>): void {
  BreakpointsConfig.setBreakpoints(breakpoints);
}

export function useBreakpoints<T extends BreakpointName>(): T {
  return useBaseBreakpoints<T>();
}

export function useCustomBreakpoints<T extends BreakpointName>(breakpoints: Breakpoints<T>): T {
  return useBaseBreakpoints(breakpoints);
}

function useBaseBreakpoints<T extends BreakpointName>(customBreakpoints?: Breakpoints<T>): T {
  const [screen, setScreen] = useState(0);
  const breakpoints = customBreakpoints || BreakpointsConfig.getBreakpoints();

  useEffect(() => {
    const setSideScreen = (): void => {
      setScreen(window.innerWidth);
    };
    setSideScreen();
    window.addEventListener('resize', setSideScreen);
    return () => {
      window.removeEventListener('resize', setSideScreen);
    };
  }, []);

  const sortedBreakpoints = useMemo(
    () => (Object.entries(breakpoints) as [T, number][]).sort((a, b) => (a[1] >= b[1] ? 1 : -1)),
    [breakpoints],
  );

  const result = sortedBreakpoints.reduce((acc, [name, width]) => {
    if (screen >= width) {
      return name;
    } else {
      return acc;
    }
  }, sortedBreakpoints[0][0]);

  return result;
}
