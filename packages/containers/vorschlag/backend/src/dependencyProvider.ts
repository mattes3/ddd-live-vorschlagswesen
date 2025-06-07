import { type HonoVariables } from '@vorschlagswesen/webtech';
import { Hono } from 'hono';

import { VorschlagIndexHandlers } from './adapters/webui/VorschlagIndexHandlers.js';
import { VorschlagHinzufuegenHandlers } from './adapters/webui/VorschlagHinzufuegenHandler.js';
import { VorschlagRepositoryImpl, VorschlagServiceImpl } from '@vorschlagswesen/dl-vorschlag';

type ConfiguredHono = Hono<{ Variables: HonoVariables }>;

export type Dependencies = {
    handlers: {
        vorschlagIndexHandlers: ConfiguredHono;
        vorschlagHinzufuegenHandlers: ConfiguredHono;
    };
};

export async function getDependencies(): Promise<Dependencies> {
    // ------------------- services --------------------
    const vorschlagService = new VorschlagServiceImpl(VorschlagRepositoryImpl);

    // ------------------- handlers --------------------

    const vorschlagIndexHandlers = VorschlagIndexHandlers();
    const vorschlagHinzufuegenHandlers = VorschlagHinzufuegenHandlers({ vorschlagService });

    const handlers = { vorschlagIndexHandlers, vorschlagHinzufuegenHandlers };

    // ------------------- combine all --------------------

    return { handlers };
}
