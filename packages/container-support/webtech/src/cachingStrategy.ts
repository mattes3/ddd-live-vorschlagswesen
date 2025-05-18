import { Context } from 'hono';
import { createMiddleware } from 'hono/factory';

// Define caching strategy
export const ONE_MINUTE = 60;
export const ONE_HOUR = 60 * ONE_MINUTE;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_YEAR = 365 * ONE_DAY;

export const setCache = (maxAge: number) =>
    createMiddleware(async (c, next) => {
        // you only want to cache for GET requests

        if (c.req.method === 'GET') {
            c.header(
                'Cache-control',
                `public, max-age=${maxAge}, s-maxage=${maxAge}, immutable, must-revalidate, proxy-revalidate`,
            );
        } else {
            nocacheHeaders(c);
        }

        await next();
    });

export const nocache = () =>
    createMiddleware(async (c, next) => {
        nocacheHeaders(c);
        await next();
    });

function nocacheHeaders(c: Context): void {
    c.header('Surrogate-Control', 'no-store');
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    c.header('Expires', '0');
}
