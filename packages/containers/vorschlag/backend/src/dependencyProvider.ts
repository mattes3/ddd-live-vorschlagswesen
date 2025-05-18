import { type HonoVariables } from '@vorschlagswesen/webtech';
import { Hono } from 'hono';

import { VorschlagIndexHandlers } from './adapters/webui/VorschlagIndexHandlers.js';

type ConfiguredHono = Hono<{ Variables: HonoVariables }>;

export type Dependencies = {
    handlers: {
        vorschlagIndexHandlers: ConfiguredHono;
    };
};

export async function getDependencies(): Promise<Dependencies> {
    // ------------------- handlers --------------------

    const vorschlagIndexHandlers = VorschlagIndexHandlers();

    const handlers = { vorschlagIndexHandlers };

    // ------------------- combine all --------------------

    return { handlers };
}
