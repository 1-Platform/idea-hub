/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounceFn = (callback: any, delay: number): any => {
  let timeout: null | NodeJS.Timeout = null;
  return (...args: unknown[]) => {
    const next = () => callback(...args);
    clearTimeout(timeout as NodeJS.Timeout);
    timeout = setTimeout(next, delay);
  };
};
