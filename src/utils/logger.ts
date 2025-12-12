// Conditional logging utility - logs only in development, or with anonymous mode in production
// Reduces performance impact during login by avoiding expensive console operations

const IS_DEV = process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && (window as any).__DEV__);
const ENABLE_ANON_LOGGING = false; // Set to true to enable anonymous logging in production

// Lightweight logging without styled formatting to improve performance
const safeLog = (method: 'log' | 'warn' | 'error' | 'debug' | 'info', message: string, ...args: any[]) => {
    if (!IS_DEV && !ENABLE_ANON_LOGGING) return;
    
    try {
        if (console[method]) {
            console[method](message, ...args);
        }
    } catch (e) {
        // Fail silently if logging fails
    }
};

export const logger = {
    log: (message: string, ...args: any[]) => safeLog('log', message, ...args),
    warn: (message: string, ...args: any[]) => safeLog('warn', message, ...args),
    error: (message: string, ...args: any[]) => safeLog('error', message, ...args),
    debug: (message: string, ...args: any[]) => safeLog('debug', message, ...args),
    info: (message: string, ...args: any[]) => safeLog('info', message, ...args),
};

// Export a no-op logger for use in critical paths
export const noOpLogger = {
    log: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
    info: () => {},
};
