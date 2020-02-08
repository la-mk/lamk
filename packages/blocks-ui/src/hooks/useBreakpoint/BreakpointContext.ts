import * as React from 'react'

export type Breakpoint = 0 | 1 | 2 | 3;

export const BreakpointContext = React.createContext({
  currentBreakpoint: 3 as Breakpoint
});