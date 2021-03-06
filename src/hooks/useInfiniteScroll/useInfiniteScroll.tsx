/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { debounceFn } from 'utils/debounceFn';

interface FetchState {
  isFetching: boolean;
  isFetchDisabled: boolean;
}

interface useInfiniteScrollReturnType {
  fetchState: FetchState;
  handleFetchState(state: keyof FetchState, type: boolean): void;
}

/**
 *  REF: https://upmostly.com/tutorials/build-an-infinite-scroll-component-in-react-using-react-hooks
 * Adds a event listener on scrolling and when its at bottom
 * triggers an isFetch which triggers another useEffect calling callback functiomn .. why?
 * because state will get staled if called from inside the scroll function
 */
export const useInfiniteScroll = (
  callback: () => void,
  ref?: HTMLElement | (() => HTMLElement)
): useInfiniteScrollReturnType => {
  const [fetchState, setFetchState] = useState<FetchState>({
    isFetching: false,
    isFetchDisabled: false,
  });
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    /* this can be react ref or fn that returns querySelector
     * Why fn? because querySelector needs to be fired only after mounting
     */
    const targetedElement = typeof ref === 'function' ? ref() : ref;
    // removing scroll trigger in disable state
    fetchState.isFetchDisabled
      ? (targetedElement || window).removeEventListener('scroll', debounceFn(handleScroll, 500))
      : (targetedElement || window).addEventListener('scroll', debounceFn(handleScroll, 500));
    return () =>
      (targetedElement || window).removeEventListener('scroll', debounceFn(handleScroll, 500));
  }, [fetchState.isFetchDisabled]);

  useEffect(() => {
    if (!fetchState.isFetching) return;
    callback();
  }, [fetchState.isFetching]);

  const handleScroll = useCallback(() => {
    // checks reached bottom page OR is a fetching going on OR is disabled
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.scrollHeight ||
      fetchState.isFetching ||
      fetchState.isFetchDisabled
    )
      return;
    isMounted.current && setFetchState((fetchState) => ({ ...fetchState, isFetching: true }));
  }, [fetchState.isFetching, fetchState.isFetchDisabled]);

  const handleFetchState = (state: keyof FetchState, type: boolean): void => {
    setFetchState((fetchState) => ({ ...fetchState, [state]: type }));
  };

  return {
    fetchState,
    handleFetchState,
  };
};
