import {
    type VorschlagService,
    parseFuegeVorschlagHinzuCommand,
} from '@vorschlagswesen/dl-vorschlag';
import { beginWith } from '@vorschlagswesen/modellierung';
import { Hono } from 'hono';

export const VorschlagHinzufuegenHandlers = ({
    vorschlagService,
}: {
    vorschlagService: VorschlagService;
}) => {
    const app = new Hono();

    app.post('/vorschlaege', async (c) => {
        const data = await c.req.parseBody();

        const serviceResult = await beginWith({
            aktuellerBenutzer: 'dummyBenutzerId',
            titel: data['titel'],
            businessVorteil: data['businessVorteil'],
            moeglicherUmsetzungsAufwand: data['moeglicherUmsetzungsAufwand'],
            moeglicherZeitrahmen: {
                von: data['moeglicherZeitrahmenVon'],
                bis: data['moeglicherZeitrahmenBis'],
            },
            nichtUmsKonsequenzen: data['nichtUmsKonsequenzen'],
        })
            .andThen(parseFuegeVorschlagHinzuCommand)
            .andThen((command) => vorschlagService.fuegeVorschlagHinzu(command)).promise;

        if (serviceResult.isErr()) {
            return c.json({ errors: serviceResult.error.errors }, 500);
        }

        return c.json({ message: 'Proposal added successfully' }, 201);
    });

    return app;
};
