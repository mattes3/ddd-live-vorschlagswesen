import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import { logger } from '@vorschlagswesen/logger';

import { getWebApp } from './app.js';
import { Dependencies, getDependencies } from './dependencyProvider.js';
import { initKnexAndObjection } from '@vorschlagswesen/dl-vorschlag';

let initialized = false;
let dependencies: Dependencies;
let app: Hono;

async function server() {
    try {
        if (!initialized) {
            await initKnexAndObjection();
            dependencies = await getDependencies();
            app = getWebApp(dependencies);
            initialized = true;
        }

        const port = parseInt(process.env['PORT'] ?? '0');
        if (port === 0) {
            return `Dev server for vorschlag-handlers needs a PORT environment setting.`;
        }

        serve({ fetch: app.fetch, port });
        return `Dev server for vorschlag-handlers listening on port ${port}`;
    } catch (error: unknown) {
        logger.error(error, 'vorschlagswesen_devServer error');
        return '';
    }
}

server().then(console.log).catch(console.error);
