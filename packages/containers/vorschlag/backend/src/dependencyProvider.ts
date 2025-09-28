import { Hono } from 'hono';
import { Ok } from 'ts-results-es';

import {
    FuegeVorschlagHinzuServiceImpl,
    initKnexAndObjection,
    VorschlagRepositoryImpl,
} from '@vorschlagswesen/dl-vorschlag';
import { type HonoVariables } from '@vorschlagswesen/webtech';

import { VorschlagHinzufuegenHandlers } from './adapters/webui/VorschlagHinzufuegenHandler.js';
import { VorschlagIndexHandlers } from './adapters/webui/VorschlagIndexHandlers.js';

type ConfiguredHono = Hono<{ Variables: HonoVariables }>;

export type Dependencies = {
    handlers: {
        vorschlagIndexHandlers: ConfiguredHono;
        vorschlagHinzufuegenHandlers: ConfiguredHono;
    };
};

export async function getDependencies(): Promise<Dependencies> {
    const res = await initKnexAndObjection().andThen((knex) => {
        // ------------------- services --------------------
        const fuegeVorschlagHinzu = FuegeVorschlagHinzuServiceImpl(VorschlagRepositoryImpl(knex));

        // ------------------- handlers --------------------

        const vorschlagIndexHandlers = VorschlagIndexHandlers();
        const vorschlagHinzufuegenHandlers = VorschlagHinzufuegenHandlers({
            fuegeVorschlagHinzu,
        });

        const handlers = { vorschlagIndexHandlers, vorschlagHinzufuegenHandlers };

        // ------------------- combine all --------------------

        return Ok({ handlers });
    });

    return res.isOk() ? res.value : Promise.reject(res.error);
}
