import { useEffect, useState, Dispatch, SetStateAction } from 'react';

interface useDebounceReturn<T> {
  unDebouncedState: T;
  debouncedState: T;
  setUnDebouncedState: Dispatch<SetStateAction<T>>;
  isDebouncing: boolean;
}

/**
 * This hook is made to handle debounce of states
 * @param value debounce reference
 * @param debounceInterval  interval to which debounce should happen
 */
export const useDebounce = <T extends unknown>(
  initialValue: T,
  effect?: (value: T) => void | Promise<void>,
  debounceInterval = 1000
): useDebounceReturn<T> => {
  const [unDebouncedState, setUnDebouncedState] = useState<T>(initialValue);
  const [debouncedState, setDebouncedState] = useState<T>(unDebouncedState);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);
    const debounceTimer = setTimeout(async () => {
      setDebouncedState(unDebouncedState);
      effect && (await effect(unDebouncedState));
      setIsDebouncing(false);
    }, debounceInterval);
    return () => clearTimeout(debounceTimer);
  }, [unDebouncedState, debounceInterval, effect]);

  return {
    debouncedState,
    unDebouncedState,
    setUnDebouncedState,
    isDebouncing,
  };
};
