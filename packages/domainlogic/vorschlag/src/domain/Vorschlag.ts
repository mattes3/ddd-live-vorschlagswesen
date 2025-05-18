import { BenutzerId } from '@vorschlagswesen/dl-benutzer';
import { createEvent, Pair, type Branded, type DomainEvent } from '@vorschlagswesen/modellierung';
import { Err, Ok, Result } from 'ts-results-es';

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

export type VorschlagsDaten = {
    id: VorschlagsId;
    einreicherId: BenutzerId;
    zustand: VorschlagsZustand;
    titel: string;
    businessVorteil: string;
    moeglicherUmsetzungsAufwand: Aufwand;
    moeglicherZeitrahmen: ZeitRahmen;
    nichtUmsKonsequenzen: string;
};

// @DomainEvent
export type VorschlagHinzugefuegtEvent = DomainEvent<'VorschlagHinzugefuegt', VorschlagsDaten>;

// @DomainEvent
export type VorschlagEingereichtEvent = DomainEvent<'VorschlagEingereicht', VorschlagsDaten>;

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

    constructor(d: VorschlagsDaten) {
        this.id = d.id;
        this.businessVorteil = d.businessVorteil;
        this.einreicherId = d.einreicherId;
        this.moeglicherUmsetzungsAufwand = d.moeglicherUmsetzungsAufwand;
        this.moeglicherZeitrahmen = d.moeglicherZeitrahmen;
        this.nichtUmsKonsequenzen = d.nichtUmsKonsequenzen;
        this.titel = d.titel;
        this.zustand = d.zustand;
    }

    fuegeHinzu(): Result<Pair<void, DomainEvent<string, unknown>[]>, string> {
        return Ok([undefined, [this.#createVorschlagHinzugefuegtEvent()]]);
    }

    reicheEin(
        eingereichtVon: BenutzerId,
    ): Result<Pair<void, DomainEvent<string, unknown>[]>, string> {
        if (this.zustand !== VorschlagsZustand.NEU) {
            return Err('Nur neue Vorschläge können eingereicht werden.');
        }

        this.einreicherId = eingereichtVon;
        this.zustand = VorschlagsZustand.EINGEREICHT;

        return Ok([undefined, [this.#createVorschlagEingereichtEvent()]]);
    }

    #createVorschlagHinzugefuegtEvent(): VorschlagHinzugefuegtEvent {
        return createEvent('VorschlagHinzugefuegt', this.#getVorschlagsDaten());
    }

    #createVorschlagEingereichtEvent(): VorschlagEingereichtEvent {
        return createEvent('VorschlagEingereicht', this.#getVorschlagsDaten());
    }

    #getVorschlagsDaten(): VorschlagsDaten {
        return {
            businessVorteil: this.businessVorteil,
            einreicherId: this.einreicherId,
            id: this.id,
            moeglicherUmsetzungsAufwand: this.moeglicherUmsetzungsAufwand,
            moeglicherZeitrahmen: this.moeglicherZeitrahmen,
            nichtUmsKonsequenzen: this.nichtUmsKonsequenzen,
            titel: this.titel,
            zustand: this.zustand,
        };
    }
}
