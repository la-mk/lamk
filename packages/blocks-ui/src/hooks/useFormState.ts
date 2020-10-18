import { useState, useEffect } from 'react';

export const useFormState = <T extends any>(
  model: T | undefined | null,
  defaultValue: Partial<T>,
  parameters: any[]
): [Partial<T> | {}, (formData: T) => void] => {
  const [externalState, setExternalState] = useState<Partial<T> | {}>(
    model || {}
  );

  useEffect(() => {
    if (!model) {
      setExternalState(defaultValue);
    } else {
      setExternalState(model);
    }
  }, parameters);

  return [externalState, setExternalState];
};
