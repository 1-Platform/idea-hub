import { useState } from 'react';
import { useEffect } from 'react';

/**
 *  REF: https://upmostly.com/tutorials/build-an-infinite-scroll-component-in-react-using-react-hooks
 * Adds a event listener on scrolling and when its at bottom
 * triggers an isFetch which triggers another useEffect calling callback functiomn .. why?
 * because state will get staled if called from inside the scroll function
 */

export const useInfiniteScroll = (
    callback: () => void
): [boolean, (isFetching: boolean) => void] => {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        callback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetching]);

    function handleScroll() {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
                document.documentElement.scrollHeight ||
            isFetching
        )
            return;
        setIsFetching(true);
    }

    return [isFetching, setIsFetching];
};
