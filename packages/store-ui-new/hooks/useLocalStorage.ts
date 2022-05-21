import { useCallback, useEffect } from "react";
import { useGlobalState } from "./useGlobalState";

const serializeData = <T extends any>(data: T) => {
  if (!data) {
    return "";
  }

  return JSON.stringify(data);
};

const deserializeData = <T extends any>(data: string | null): T | null => {
  if (!data) {
    return null;
  }

  return JSON.parse(data) as T;
};

export const useLocalStorage = <T extends any>(key: string) => {
  const [currentValue, setCurrentValue] = useGlobalState<T | null>(key, () => {
    if (typeof window === "undefined") {
      return null;
    }

    return deserializeData<T>(localStorage.getItem(key));
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handler = (e: StorageEvent) => {
      if (e.storageArea === localStorage && e.key === key) {
        setCurrentValue(deserializeData(e.newValue));
      }
    };

    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("storage", handler);
    };
  }, [key, setCurrentValue]);

  const handleSetCurrentValue = useCallback(
    (func: ((oldVal: T | null) => T | null) | T | null) => {
      let newVal = func;
      if (typeof func === "function") {
        newVal = (func as Function)(currentValue);
      }

      setCurrentValue(newVal as T | null);
      localStorage.setItem(key, serializeData(newVal));
    },
    [currentValue, setCurrentValue, key]
  );

  return [currentValue, handleSetCurrentValue] as const;
};
