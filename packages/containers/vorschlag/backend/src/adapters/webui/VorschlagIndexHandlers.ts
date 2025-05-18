import { Hono } from 'hono';
import { pageMeta, type HonoVariables } from '@vorschlagswesen/webtech';
import { render } from './renderer.js';

export const VorschlagIndexHandlers = (): Hono<{ Variables: HonoVariables }> => {
    const app = new Hono<{ Variables: HonoVariables }>();

    app.get('/', async (c) => {
        const year = new Date().getFullYear();
        return c.html(
            render('index.html', {
                pageMeta: pageMeta(c.req.raw, {
                    title: 'Vorschlagswesen online',
                    description: 'Vorschläge einreichen, kommentieren, genehmigen, besser werden!',
                }),
                actualYearNumber: year > 2024 ? `2024-${year}` : `2024`,
            }),
        );
    });

    return app;
};
