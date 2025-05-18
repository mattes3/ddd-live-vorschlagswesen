import fs from 'fs';
import { serveStatic as ss } from 'hono/serve-static';
import { promisify } from 'util';

export const serveStatic = (rootDirectory: string) =>
    ss({
        async getContent(pathName, _c) {
            return promisify(fs.readFile)(pathName, 'utf8').catch(() => null);
        },
        root: rootDirectory,
    });
