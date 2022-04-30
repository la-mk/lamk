import { useEffect, useState } from "react";

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
  const [currentValue, setCurrentValue] = useState<T | null>(() => {
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
  }, [key]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(key, serializeData(currentValue));
  }, [key, currentValue]);

  return [currentValue, setCurrentValue] as const;
};
