declare global {
    interface Window {
        __RUNTIME_CONFIG__: {
            [key: string]: string
        }
    }
}

/**
 * Retrieves an environment variable. Depending on whether running in development or
 * production mode the variables are either retrieved from `process.env` (development)
 * or `window.__RUNTIME_CONFIG__` (production).
 *
 * @param key The name of the environment variable to retrieve.
 * @returns The value of the given environment variable or `undefined` if it could
 *          not be found.
 */
export default function env(key: string): string | undefined {
    if (typeof window.__RUNTIME_CONFIG__ !== 'undefined') {
        return window.__RUNTIME_CONFIG__[key]
    }

    return process.env[key]
}
