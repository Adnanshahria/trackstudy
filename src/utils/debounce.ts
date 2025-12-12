export interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): void;
    cancel: () => void;
    flush: () => void;
}

export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
): DebouncedFunction<T> => {
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    const safeDelay = Math.max(0, Math.min(delay, 60000));
    
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;

    const debouncedFn = (...args: Parameters<T>) => {
        lastArgs = args;
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            if (lastArgs) {
                func(...lastArgs);
            }
            timeoutId = null;
            lastArgs = null;
        }, safeDelay);
    };

    debouncedFn.cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        lastArgs = null;
    };

    debouncedFn.flush = () => {
        if (timeoutId !== null && lastArgs) {
            clearTimeout(timeoutId);
            func(...lastArgs);
            timeoutId = null;
            lastArgs = null;
        }
    };

    return debouncedFn;
};
