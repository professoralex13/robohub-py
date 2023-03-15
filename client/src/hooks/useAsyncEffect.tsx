import { useEffect, useState } from 'react';

export function useAsyncEffect<T, I>(factory: () => Promise<T>, deps: any[], initial: I): T | I {
    const [state, setState] = useState<T | I>(initial);

    useEffect(() => {
        factory().then(setState);
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    return state;
}
