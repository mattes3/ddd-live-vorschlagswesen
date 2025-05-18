import { ulid } from 'ulid';
import { describe, expect, it } from 'vitest';
import { Vorschlag, VorschlagsZustand } from '../../src';

describe('Vorschlag', () => {
    it('erstellt eine Vorschlag-Entity mit den Initial-Daten', () => {
        const neueVorschlagsId = ulid();
        const dummyBenutzerId = ulid();
        const dummyZeitRahmen = { von: new Date(), bis: new Date() };

        const v = new Vorschlag({
            id: neueVorschlagsId,
            einreicherId: dummyBenutzerId,
            zustand: VorschlagsZustand.NEU,
            titel: 'Mehr Kaffee',
            businessVorteil: 'Leute arbeiten schneller',
            moeglicherUmsetzungsAufwand: 10,
            moeglicherZeitrahmen: dummyZeitRahmen,
            nichtUmsKonsequenzen: 'alles bleibt wie es war',
        });

        expect(v.id).toBe(neueVorschlagsId);
        expect(v.einreicherId).toBe(dummyBenutzerId);
        expect(v.zustand).toBe(VorschlagsZustand.NEU);
        expect(v.businessVorteil).toBe('Leute arbeiten schneller');
        expect(v.moeglicherUmsetzungsAufwand).toBe(10);
        expect(v.moeglicherZeitrahmen).toStrictEqual(dummyZeitRahmen);
        expect(v.nichtUmsKonsequenzen).toBe('alles bleibt wie es war');
    });
});
