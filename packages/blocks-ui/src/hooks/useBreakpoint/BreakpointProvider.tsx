import * as React from 'react';
import debounce from 'lodash/debounce';
import { BreakpointContext, Breakpoint } from './BreakpointContext';

export interface BreakpointProviderProps {
  breakpoints: number[];
  onBreakpointChange?: (breakpoint: Breakpoint) => void;
}

export const BreakpointProvider: React.FC<BreakpointProviderProps> = ({
  breakpoints,
  onBreakpointChange,
  children,
}) => {
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState(
    0 as Breakpoint
  );

  React.useLayoutEffect(() => {
    const handleResize = () => {
      const clientWidth = window.innerWidth;
      if (clientWidth < breakpoints[0]) {
        setCurrentBreakpoint(0);
      } else if (clientWidth < breakpoints[1]) {
        setCurrentBreakpoint(1);
      } else {
        setCurrentBreakpoint(2);
      }
    };

    const debouncedResize = debounce(handleResize, 80);

    window.addEventListener('resize', debouncedResize, { passive: true });
    handleResize();

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
