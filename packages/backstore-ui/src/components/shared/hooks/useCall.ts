import { toast } from '@la-mk/blocks-ui';
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

type Caller = <T extends any>(
  promise: Promise<T>,
  callback?: (res: T) => Action<any> | void
) => void;

export interface Action<T = any> {
  type: T;
}

type UseCallResult = [Caller, boolean];

export const useCall = (initialProcessingStatus = false): UseCallResult => {
  const [isProcessing, setIsProcessing] = useState(initialProcessingStatus);
  const dispatch = useDispatch();

  // The callback can optionally return a redux action object which will be dispatched
  const caller = useCallback<Caller>(
    (promise, callback) => {
      setIsProcessing(true);
      promise
        .then(res => {
          if (callback) {
            const action = callback(res);
            if (action) {
              dispatch(action);
            }
          }
        })
        // TODO: Localize error based on code.
        .catch((err: Error) => toast.error(err.message))
        .finally(() => setIsProcessing(false));
    },
    [dispatch]
  );

  return [caller, isProcessing];
};
