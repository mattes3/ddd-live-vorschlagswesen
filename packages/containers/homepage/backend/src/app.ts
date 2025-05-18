import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import path from 'path';
import { fileURLToPath } from 'url';

import { logger } from '@vorschlagswesen/logger';
import { ONE_MINUTE, ONE_YEAR, serveStatic, setCache } from '@vorschlagswesen/webtech';

import { type Dependencies } from './dependencyProvider.js';

import { createPageRouter } from './pageRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webDir = path.join(__dirname, '..', '..', 'frontend');
const faviconDir = path.join(webDir, 'favicon');

export function getWebApp(dependencies: Dependencies): Hono {
    const app = new Hono();

    // Make sure that the URL contains the protocol
    // that the reverse proxy told us!
    app.use(async (c, next) => {
        const forwardedProto = c.req.header('x-forwarded-proto');
        if (forwardedProto === 'https' && !c.req.url.includes('https:')) {
            const newUrl = c.req.url.toString().replace('http:', 'https:');
            Object.defineProperty(c.req, 'url', {
                value: newUrl,
                configurable: true,
            });
            Object.defineProperty(c.req.raw, 'url', {
                value: newUrl,
                configurable: true,
            });
        }

        await next();
    });

    app.use(async (c, next) => {
        const logger = honoLogger((str, ...rest) => {
            if (str.startsWith('<--')) {
                console.log(str, c.req.header('x-forwarded-for'), ...rest);
            } else {
                console.log(str, ...rest);
            }
        });

        return logger(c, next);
    });
    app.use(compress());
    app.use(cors());

    // routers must be last so that the above middleware can do its job first
    app.route('/', createPageRouter(dependencies));

    app.use('/assets/*', setCache(ONE_YEAR), serveStatic(webDir));
    app.use('/*', setCache(ONE_MINUTE), serveStatic(faviconDir));

    app.onError((err, c) => {
        logger.error(err, 'HTTP request processing error');
        return 'getResponse' in err ? err.getResponse() : c.json({ error: err.message }, 500);
    });

    return app;
}
