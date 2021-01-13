import { useEffect, useState, useMemo } from 'react';
import { BreakpointName, Breakpoints } from './types';

class BreakpointsConfig {
  // Inspired by tailwindcss
  static breakpoints: Breakpoints = {
    '2xl': 1536,
    xl: 1280,
    lg: 1024,
    md: 768,
    sm: 640,
  };

  static setBreakpoints(breakpoints: Breakpoints): void {
    this.breakpoints = breakpoints;
  }

  static getBreakpoints(): Breakpoints {
    return this.breakpoints;
  }
}

/**
 * Breakpoint format is <name (string | number): minWidth (number)>
 */
export function setDefaultBreakpoints(breakpoints: Breakpoints): void {
  BreakpointsConfig.setBreakpoints(breakpoints);
}

export function useBreakpoints(): BreakpointName {
  return useBaseBreakpoints();
}

export function useCustomBreakpoints(breakpoints: Breakpoints): BreakpointName {
  return useBaseBreakpoints(breakpoints);
}

function useBaseBreakpoints(customBreakpoints?: Breakpoints): BreakpointName {
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
    () => Object.entries(breakpoints).sort((a, b) => (a[1] >= b[1] ? 1 : -1)),
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
