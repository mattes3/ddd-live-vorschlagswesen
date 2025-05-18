import { csrfProtection, HonoVariables, ONE_MINUTE, setCache } from '@vorschlagswesen/webtech';
import { Hono } from 'hono';

import { Dependencies } from './dependencyProvider.js';

export function createPageRouter({ handlers }: Dependencies): Hono<{ Variables: HonoVariables }> {
    const { homepageHandlers } = handlers;

    // Define routes

    // ============================= NON-AUTHENTICATED, CACHING =============================

    const cachingRoutes = new Hono<{ Variables: HonoVariables }>();

    cachingRoutes.route('/', homepageHandlers);

    const pageRouter = new Hono<{ Variables: HonoVariables }>();

    const cacheConfig = setCache(ONE_MINUTE);

    const cr = new Hono<{ Variables: HonoVariables }>();
    cr.use(cacheConfig);
    cr.use(csrfProtection());
    cr.route('/', cachingRoutes);

    pageRouter.route('/', cr);

    return pageRouter;
}
