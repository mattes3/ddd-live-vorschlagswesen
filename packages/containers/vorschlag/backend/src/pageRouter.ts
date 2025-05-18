import {
    csrfProtection,
    HonoVariables,
    nocache,
    ONE_MINUTE,
    setCache,
} from '@vorschlagswesen/webtech';
import { Hono } from 'hono';

import { Dependencies } from './dependencyProvider.js';

export function createPageRouter({ handlers }: Dependencies): Hono<{ Variables: HonoVariables }> {
    const { vorschlagIndexHandlers } = handlers;

    // Define routes

    // ============================== AUTHENTICATED, NON-CACHING ============================

    const nonCachingRoutes = new Hono<{ Variables: HonoVariables }>();

    // nonCachingRoutes.route('/', vorschlagHandlersNonCacheable);

    // ============================= NON-AUTHENTICATED, CACHING =============================

    const cachingRoutes = new Hono<{ Variables: HonoVariables }>();

    cachingRoutes.route('/', vorschlagIndexHandlers);

    const pageRouter = new Hono<{ Variables: HonoVariables }>();

    const ncr = new Hono<{ Variables: HonoVariables }>();
    ncr.use(nocache());
    ncr.use(csrfProtection());
    ncr.route('/', nonCachingRoutes);

    const cacheConfig = setCache(ONE_MINUTE);

    const cr = new Hono<{ Variables: HonoVariables }>();
    cr.use(cacheConfig);
    cr.use(csrfProtection());
    cr.route('/', cachingRoutes);

    pageRouter.route('/nc', ncr);
    pageRouter.route('/c', cr);

    return pageRouter;
}
