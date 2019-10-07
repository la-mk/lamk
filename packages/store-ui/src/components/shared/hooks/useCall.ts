import { useState, useCallback } from 'react';
import { message } from '@lamk/blocks-ui';
import { useDispatch } from 'react-redux';

export const useCall = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [res, setRes] = useState();
  const dispatch = useDispatch();

  // The callback can optionally return a redux action object which will be dispatched
  const caller = useCallback(
    (
      promise: Promise<any>,
      callback?: (data?: any) => { type: string; [key: string]: any },
    ) => {
      setIsProcessing(true);
      promise
        .then(res => {
          setRes(res);
          if (callback) {
            const action = callback(res);
            if (action) {
              dispatch(action);
            }
          }
        })
        .catch((err: Error) => message.error(err.message))
        .finally(() => setIsProcessing(false));
    },
    [dispatch],
  );

  return [caller, isProcessing, res];
};
