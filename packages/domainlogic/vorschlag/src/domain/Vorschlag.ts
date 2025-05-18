import { BenutzerId } from '@vorschlagswesen/dl-benutzer';
import type { Branded, DomainEvent } from '@vorschlagswesen/modellierung';

export type VorschlagsId = Branded<string, 'VorschlagsId'>;

// @ValueObject
export enum VorschlagsZustand {
    NEU = 'NEU',
    EINGEREICHT = 'EINGEREICHT',
    GENEHMIGT = 'GENEHMIGT',
    ABGELEHNT = 'ABGELEHNT',
    ARCHIVIERT = 'ARCHIVIERT',
}

// @ValueObject
export type Aufwand = Branded<number, 'Personentage'>;

// @ValueObject
export type ZeitRahmen = {
    von: Date;
    bis: Date;
};

// @Entity
export class Vorschlag {
    public id: VorschlagsId;
    public einreicherId: BenutzerId;
    public zustand: VorschlagsZustand;
    public titel: string;
    public businessVorteil: string;
    public moeglicherUmsetzungsAufwand: Aufwand;
    public moeglicherZeitrahmen: ZeitRahmen;
    public nichtUmsKonsequenzen: string;

    constructor(d: {
        id: string;
        einreicherId: BenutzerId;
        zustand: VorschlagsZustand;
        titel: string;
        businessVorteil: string;
        moeglicherUmsetzungsAufwand: Aufwand;
        moeglicherZeitrahmen: ZeitRahmen;
        nichtUmsKonsequenzen: string;
    }) {
        this.id = d.id as VorschlagsId;
        this.businessVorteil = d.businessVorteil;
        this.einreicherId = d.einreicherId;
        this.moeglicherUmsetzungsAufwand = d.moeglicherUmsetzungsAufwand;
        this.moeglicherZeitrahmen = d.moeglicherZeitrahmen;
        this.nichtUmsKonsequenzen = d.nichtUmsKonsequenzen;
        this.titel = d.titel;
        this.zustand = d.zustand;
    }

    fuegeHinzu(hinzugefuegtVon: BenutzerId): DomainEvent<string, unknown>[] {
        // TODO
        return [];
    }

    reicheEin(eingereichtVon: BenutzerId): DomainEvent<string, unknown>[] {
        // TODO
        return [];
    }
}
