import { useEffect, useRef, useState } from 'react';

export const useStateRef = <T extends unknown>(
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>, React.MutableRefObject<T>] => {
  const [value, setValue] = useState<T>(initialValue);

  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, setValue, ref];
};
