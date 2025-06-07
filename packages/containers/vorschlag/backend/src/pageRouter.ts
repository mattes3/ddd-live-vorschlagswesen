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
    const { vorschlagIndexHandlers, vorschlagHinzufuegenHandlers } = handlers;

    // Define routes

    // ============================= NON-AUTHENTICATED, CACHING =============================

    const cachingRoutes = new Hono<{ Variables: HonoVariables }>();
    cachingRoutes.route('/vorschlaege', vorschlagIndexHandlers);

    const cacheConfig = setCache(ONE_MINUTE);

    const cr = new Hono<{ Variables: HonoVariables }>();
    cr.use(cacheConfig);
    cr.use(csrfProtection());
    cr.route('/', cachingRoutes);

    // ============================== AUTHENTICATED, NON-CACHING ============================

    const nonCachingRoutes = new Hono<{ Variables: HonoVariables }>();
    nonCachingRoutes.route('/vorschlaege', vorschlagHinzufuegenHandlers);

    const ncr = new Hono<{ Variables: HonoVariables }>();
    ncr.use(nocache());
    ncr.use(csrfProtection());
    ncr.route('/', nonCachingRoutes);

    // ============================= ASSEMBLY =============================

    const pageRouter = new Hono<{ Variables: HonoVariables }>();

    pageRouter.route('/nc', ncr);
    pageRouter.route('/c', cr);

    return pageRouter;
}
