import {
    type FuegeVorschlagHinzuService,
    parseFuegeVorschlagHinzuServiceParams,
} from '@vorschlagswesen/dl-vorschlag';
import { beginWith } from '@vorschlagswesen/modellierung';
import { HonoVariables } from '@vorschlagswesen/webtech';
import { Hono } from 'hono';

import { render } from './renderer.js';

export const VorschlagHinzufuegenHandlers = ({
    fuegeVorschlagHinzu,
}: {
    fuegeVorschlagHinzu: FuegeVorschlagHinzuService;
}): Hono<{ Variables: HonoVariables }> => {
    const app = new Hono<{ Variables: HonoVariables }>();

    app.post('/', async (c) => {
        const data = await c.req.parseBody();

        const serviceResult = await beginWith({
            einreicherId: 'dummyBenutzerId',
            titel: data['titel'],
            businessVorteil: data['businessVorteil'],
            moeglicherUmsetzungsAufwand: data['moeglicherUmsetzungsAufwand'],
            moeglicherZeitrahmen: {
                von: data['moeglicherZeitrahmenVon'],
                bis: data['moeglicherZeitrahmenBis'],
            },
            nichtUmsKonsequenzen: data['nichtUmsKonsequenzen'],
        })
            .andThen(parseFuegeVorschlagHinzuServiceParams)
            .andThen(fuegeVorschlagHinzu);

        if (serviceResult.isErr()) {
            return c.html(
                render('partials/vorschlag-form.html', {
                    ...data,
                    errorMessagesPresent: true,
                    errorMessages: serviceResult.error.errors.map((msg) => ({ msg })),
                }),
            );
        }

        return c.text('Vorschlag erfolgreich angelegt', 200, {
            // zurück auf die Seite mit den Vorschlägen!
            'HX-Redirect': '/vorschlag/c/vorschlaege',
        });
    });

    return app;
};
