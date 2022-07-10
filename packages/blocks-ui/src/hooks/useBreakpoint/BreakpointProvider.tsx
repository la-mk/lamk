import * as React from 'react';
import debounce from 'lodash/debounce';
import { BreakpointContext, Breakpoint } from './BreakpointContext';

export interface BreakpointProviderProps {
  breakpoints: number[];
  onBreakpointChange?: (breakpoint: Breakpoint) => void;
  children: React.ReactNode;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

const handleResize = (
  clientWidth: number,
  breakpoints: number[]
): Breakpoint => {
  if (clientWidth < breakpoints[0]) {
    return 0;
  } else if (clientWidth < breakpoints[1]) {
    return 1;
  } else {
    return 2;
  }
};

export const BreakpointProvider: React.FC<BreakpointProviderProps> = ({
  breakpoints,
  onBreakpointChange,
  children,
}) => {
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState(
    typeof window === 'undefined'
      ? 0
      : handleResize(window.innerWidth, breakpoints)
  );

  useIsomorphicLayoutEffect(() => {
    // Returning here doesn't matter since this will only run on the server
    if (typeof window === 'undefined') {
      return;
    }

    const debouncedResize = debounce(
      () => setCurrentBreakpoint(handleResize(window.innerWidth, breakpoints)),
      80
    );
    window.addEventListener('resize', debouncedResize, { passive: true });
    setCurrentBreakpoint(handleResize(window.innerWidth, breakpoints));

    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [breakpoints]);

  React.useEffect(() => {
    if (onBreakpointChange) {
      onBreakpointChange(currentBreakpoint);
    }
  }, [currentBreakpoint]);

  return (
    <BreakpointContext.Provider value={{ currentBreakpoint }}>
      {children}
    </BreakpointContext.Provider>
  );
};

BreakpointProvider.displayName = 'BreakpointProvider';
