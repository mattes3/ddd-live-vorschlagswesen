import { BenutzerId } from '@vorschlagswesen/dl-benutzer';
import { ulid } from 'ulid';
import { describe, it } from 'node:test';
import { expect } from 'expect';
import { Aufwand, createVorschlag, VorschlagId, Vorschlag, VorschlagsZustand } from '../src';

describe('Vorschlag', () => {
    const neueVorschlagsId = ulid() as VorschlagId;
    const dummyBenutzerId = ulid() as BenutzerId;
    const dummyZeitRahmen = { von: new Date(), bis: new Date() };
    const dummyAufwand = 10 as Aufwand;

    function erzeugeTestVorschlag(): Vorschlag {
        return createVorschlag({
            id: neueVorschlagsId,
            einreicherId: dummyBenutzerId,
            zustand: VorschlagsZustand.NEU,
            titel: 'Mehr Kaffee',
            businessVorteil: 'Leute arbeiten schneller',
            moeglicherUmsetzungsAufwand: dummyAufwand,
            moeglicherZeitrahmen: dummyZeitRahmen,
            nichtUmsKonsequenzen: 'alles bleibt wie es war',
        });
    }

    it('sollte ein Exemplar anlegen', () => {
        const v = erzeugeTestVorschlag();

        expect(v.id).toBe(neueVorschlagsId);
        expect(v.einreicherId).toBe(dummyBenutzerId);
        expect(v.zustand).toBe(VorschlagsZustand.NEU);
        expect(v.businessVorteil).toBe('Leute arbeiten schneller');
        expect(v.moeglicherUmsetzungsAufwand).toBe(dummyAufwand);
        expect(v.moeglicherZeitrahmen).toStrictEqual(dummyZeitRahmen);
        expect(v.nichtUmsKonsequenzen).toBe('alles bleibt wie es war');
    });

    it('reicheEin', async () => {
        const v = erzeugeTestVorschlag();
        const r = v.reicheEin();
        expect(r.isOk()).toBeTruthy();
        expect(v.zustand).toBe(VorschlagsZustand.EINGEREICHT);
    });

    it('genehmige', async () => {
        const v = erzeugeTestVorschlag();
        let r = v.genehmige();
        expect(r.isErr()).toBeTruthy();
        expect(v.zustand).toBe(VorschlagsZustand.NEU);

        r = v.reicheEin();
        expect(r.isOk()).toBeTruthy();
        expect(v.zustand).toBe(VorschlagsZustand.EINGEREICHT);

        r = v.genehmige();
        expect(r.isOk()).toBeTruthy();
        expect(v.zustand).toBe(VorschlagsZustand.GENEHMIGT);
    });

    it('lehneAb', async () => {
        const v = erzeugeTestVorschlag();
        const r = v.lehneAb('Kosten/Nutzen nicht attraktiv genug');
        expect(r.isErr()).toBeTruthy();
        expect(v.zustand).toBe(VorschlagsZustand.NEU);
    });

    it('verschiebe', async () => {
        const v = erzeugeTestVorschlag();
        const r = v.verschiebe({ von: new Date(), bis: new Date() });
        expect(r.isErr()).toBeTruthy();
        expect(v.zustand).toBe(VorschlagsZustand.NEU);
    });

    it('archiviere', async () => {
        const v = erzeugeTestVorschlag();
        const r = v.archiviere();
        expect(r.isOk()).toBeTruthy();
        expect(v.zustand).toBe(VorschlagsZustand.ARCHIVIERT);
    });
});
