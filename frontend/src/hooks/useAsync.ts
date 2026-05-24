import { useEffect, useState } from 'react';

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

export const useAsync = <TResult = unknown>(asyncFunction: () => Promise<TResult | { data?: TResult }>, immediate = true) => {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<unknown>(null);

  const execute = async (): Promise<TResult | { data?: TResult }> => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData((response as { data?: TResult }).data || (response as TResult));
      setStatus('success');
      return response;
    } catch (error: unknown) {
      setError(error);
      setStatus('error');
      throw error;
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  return { execute, status, data, error };
};

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((value: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error: unknown) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((currentValue: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
