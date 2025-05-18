import { BenutzerId } from '@vorschlagswesen/dl-benutzer';
import { ulid } from 'ulid';
import { describe, expect, it } from 'vitest';

import { Aufwand, Vorschlag, VorschlagsId, VorschlagsZustand } from '../../src';

describe('Vorschlag', () => {
    it('erstellt eine Vorschlag-Entity und reicht sie ein', () => {
        const neueVorschlagsId = ulid();
        const dummyBenutzerId = ulid() as BenutzerId;
        const dummyZeitRahmen = { von: new Date(), bis: new Date() };
        const dummyAufwand = 10 as Aufwand;

        const v = new Vorschlag({
            id: neueVorschlagsId as VorschlagsId,
            einreicherId: dummyBenutzerId,
            zustand: VorschlagsZustand.NEU,
            titel: 'Mehr Kaffee',
            businessVorteil: 'Leute arbeiten schneller',
            moeglicherUmsetzungsAufwand: dummyAufwand,
            moeglicherZeitrahmen: dummyZeitRahmen,
            nichtUmsKonsequenzen: 'alles bleibt wie es war',
        });

        expect(v.id).toBe(neueVorschlagsId);
        expect(v.einreicherId).toBe(dummyBenutzerId);
        expect(v.zustand).toBe(VorschlagsZustand.NEU);
        expect(v.businessVorteil).toBe('Leute arbeiten schneller');
        expect(v.moeglicherUmsetzungsAufwand).toBe(dummyAufwand);
        expect(v.moeglicherZeitrahmen).toStrictEqual(dummyZeitRahmen);
        expect(v.nichtUmsKonsequenzen).toBe('alles bleibt wie es war');

        const r1 = v.fuegeHinzu();
        expect(r1.isOk()).toBeTruthy();
        if (r1.isOk()) {
            expect(r1.value[0]).toBeUndefined();
            const eventListe = r1.value[1];
            expect(eventListe).toHaveLength(1);
            expect(eventListe[0].typ).toBe('VorschlagHinzugefuegt');
        }

        const r2 = v.reicheEin(dummyBenutzerId);
        expect(r2.isOk()).toBeTruthy();
        if (r2.isOk()) {
            expect(r2.value[0]).toBeUndefined();
            const eventListe = r2.value[1];
            expect(eventListe).toHaveLength(1);
            expect(eventListe[0].typ).toBe('VorschlagEingereicht');
        }
    });
});
