import * as React from 'react';
import { BreakpointContext } from './BreakpointContext';

export const useBreakpoint = <T extends any>(values: Array<T>): T => {
  const { currentBreakpoint } = React.useContext(BreakpointContext);
  if (values.length !== 4) {
    throw new Error('There should be exactly 4 value entries');
  }

  return values[currentBreakpoint];
};
