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
    const debouncedResize = debounce(handleResize, 80);

    window.addEventListener('resize', debouncedResize, { passive: true });
    handleResize();

    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  React.useEffect(() => {
    if (onBreakpointChange) {
      onBreakpointChange(currentBreakpoint);
    }
  }, [currentBreakpoint]);

  const handleResize = () => {
    const clientWidth = window.innerWidth;
    if (clientWidth < breakpoints[0]) {
      setCurrentBreakpoint(0);
    } else if (clientWidth < breakpoints[1]) {
      setCurrentBreakpoint(1);
    } else if (clientWidth < breakpoints[2]) {
      setCurrentBreakpoint(2);
    } else if (clientWidth <= breakpoints[3] || clientWidth > breakpoints[3]) {
      setCurrentBreakpoint(3);
    }
  };

  return (
    <BreakpointContext.Provider value={{ currentBreakpoint }}>
      {children}
    </BreakpointContext.Provider>
  );
};

BreakpointProvider.displayName = 'BreakpointProvider';
