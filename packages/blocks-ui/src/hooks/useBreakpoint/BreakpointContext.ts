import * as React from 'react'

export type Breakpoint = 0 | 1 | 2;

export const BreakpointContext = React.createContext({
  currentBreakpoint: 2 as Breakpoint
});