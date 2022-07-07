import { useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";

const { useGlobalState: useGlobalStateBase } = createGlobalState({
  "cookies-consent": null,
  "analytics-event-queue": [],
  store: null,
  cart: { items: [] },
} as { [key: string]: any });

export const useGlobalState = <T extends any>(
  key: string,
  initialVal: T | (() => T)
) => {
  const [storeVal, setter] = useGlobalStateBase(key);
  useEffect(() => {
    if (typeof initialVal === "function") {
      setter((initialVal as Function)());
    } else {
      setter(initialVal);
    }
    // eslint-disable-next-line
  }, [setter]);

  return [storeVal as T, setter] as const;
};
