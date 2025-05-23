import { BenutzerId } from '@vorschlagswesen/dl-benutzer';
import { ulid } from 'ulid';
import { describe, expect, it } from 'vitest';

import {
    Aufwand,
    FuegeVorschlagHinzuCommand,
    VorschlagRepositoryImpl,
    VorschlagServiceImpl,
    initKnexAndObjection,
} from '../../src';

describe('VorschlagService', async () => {
    await initKnexAndObjection();

    it('fuegt einen Vorschlag hinzu', async () => {
        const dummyBenutzerId = ulid() as BenutzerId;
        const dummyZeitRahmen = { von: new Date(), bis: new Date() };
        const dummyAufwand = 10 as Aufwand;

        const command: FuegeVorschlagHinzuCommand = {
            aktuellerBenutzer: dummyBenutzerId,
            titel: 'irgendein Vorschlag',
            nichtUmsKonsequenzen: 'dann sind wir sauer',
            businessVorteil: 'irgendein Vorteil',
            moeglicherUmsetzungsAufwand: dummyAufwand,
            moeglicherZeitrahmen: dummyZeitRahmen,
        };

        const service = new VorschlagServiceImpl(VorschlagRepositoryImpl);

        const ergebnis = await service.fuegeVorschlagHinzu(command);
        expect(ergebnis.isOk()).toBeTruthy();
    });
});
