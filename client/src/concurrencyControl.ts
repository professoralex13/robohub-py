/**
 * Prevents unccesary asyncronous validation calls by only re-xecuting when value changes and ensuring only one request is queued at a time
 * @param asyncValidate Validation callback function
 * @returns The wrapped validator function
 */
export const concurrentControledTest = <I, R>(asyncValidate: (value: I) => Promise<R>, defaultValue: R) => {
    let valid: R = defaultValue; // Stores latest validation result
    let previousValue: I | null = null; // Stores previous input value that was validated
    let currentPromise: Promise<R> | null = null; // Stores reference to currently executing validation promise
    const requestStack: (() => void)[] = []; // stack to store requests made while waiting for the current promise to resolve

    const executeRequest = async (value: any) => {
        const response = await asyncValidate(value);

        valid = response;
        currentPromise = null;

        // resolve all the requests in the stack with the validation result
        while (requestStack.length > 0) {
            const nextRequest = requestStack.pop();
            if (nextRequest) {
                nextRequest();
            }
        }

        return response;
    };

    return async (value: I) => {
        if (value === previousValue) { // if the value is the same as the previous one, return the cached result
            return valid;
        }

        if (!currentPromise) { // if there is no current promise, make a new one
            previousValue = value;
            currentPromise = executeRequest(value);
            return currentPromise;
        }

        return new Promise<R>((resolve) => {
            // if there is a current promise, add the resolve function to the stack
            // it will be called once the current promise is resolved
            requestStack.push(async () => {
                await currentPromise; // wait for the current promise to resolve
                resolve(valid); // resolve with the cached validation result
            });
        });
    };
};
