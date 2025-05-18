import { type HonoVariables } from '@vorschlagswesen/webtech';
import { Hono } from 'hono';

import { HomepageHandlers } from './adapters/webui/HomepageHandlers.js';

type ConfiguredHono = Hono<{ Variables: HonoVariables }>;

export type Dependencies = {
    handlers: {
        homepageHandlers: ConfiguredHono;
    };
};

export async function getDependencies(): Promise<Dependencies> {
    // ------------------- handlers --------------------

    const homepageHandlers = HomepageHandlers();

    const handlers = { homepageHandlers };

    // ------------------- combine all --------------------

    return { handlers };
}
