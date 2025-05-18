import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import path from 'path';
import { fileURLToPath } from 'url';

import { logger } from '@vorschlagswesen/logger';

import { ONE_YEAR, serveStatic, setCache } from '@vorschlagswesen/webtech';
import { Dependencies } from './dependencyProvider.js';
import { createPageRouter } from './pageRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webDir = path.join(__dirname, '..', '..', 'frontend');

export function getWebApp(dependencies: Dependencies): Hono {
    const app = new Hono();

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

    const removeFirstPart = (path: string): string => '/' + path.split('/').slice(2).join('/');
    /*
        e.g. for path = "/aaa/bbb/ccc"
        - split('/') turns the string into an array: ["", "aaa", "bbb", "ccc"]
        - slice(2) removes the first non-empty part ("aaa")
        - join('/') reconstructs the path
    */

    const staticAssetsRouter = new Hono();
    staticAssetsRouter.use(
        setCache(ONE_YEAR),
        (c, next) => {
            c.req.path = removeFirstPart(c.req.path);
            return next();
        },
        serveStatic(webDir),
    );
    app.route('/vorschlag/assets/*', staticAssetsRouter);

    // routers must be last so that the above middleware can do its job first
    app.route('/vorschlag', createPageRouter(dependencies));

    app.onError((err, c) => {
        logger.error(err, 'HTTP request processing error');
        return 'getResponse' in err ? err.getResponse() : c.json({ error: err.message }, 500);
    });

    return app;
}
