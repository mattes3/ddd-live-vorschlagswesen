import { BenutzerId } from '@vorschlagswesen/dl-benutzer';
import { ulid } from 'ulid';
import { describe, expect, it } from 'vitest';

import { FuegeVorschlagHinzuCommand, Aufwand, Vorschlag, VorschlagsId, VorschlagsZustand, VorschlagServiceImpl, VorschlagRepository } from '../../src';

describe('VorschlagService', () => {
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
            moeglicherZeitrahmen: dummyZeitRahmen
        };

        let gemerkt: Vorschlag | undefined = undefined;

        const repo: VorschlagRepository = {
            async add(vorschlag) {
                gemerkt = vorschlag;
            },

            async getAll() {
                return [];
            },
        };

        const service = new VorschlagServiceImpl((f) => f(repo));

        const ergebnis = await service.fuegeVorschlagHinzu(command);
        expect(ergebnis.isOk()).toBeTruthy();

        expect(gemerkt).toBeDefined();
    });
});
