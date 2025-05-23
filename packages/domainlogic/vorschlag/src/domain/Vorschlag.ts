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
export type Vorschlag = VorschlagsDaten & {
    fuegeHinzu(): Result<Pair<void, DomainEvent<string, unknown>[]>, Error>;
    reicheEin(
        eingereichtVon: BenutzerId,
    ): Result<Pair<void, DomainEvent<string, unknown>[]>, Error>;
};

// @Factory
export function createVorschlag(d: VorschlagsDaten): Vorschlag {
    return {
        ...d,

        fuegeHinzu() {
            return Ok([undefined, [createVorschlagHinzugefuegtEvent(this)]]);
        },

        reicheEin(eingereichtVon) {
            if (this.zustand !== VorschlagsZustand.NEU) {
                return Err(new Error('Nur neue Vorschläge können eingereicht werden.'));
            }

            this.einreicherId = eingereichtVon;
            this.zustand = VorschlagsZustand.EINGEREICHT;

            return Ok([undefined, [createVorschlagEingereichtEvent(this)]]);
        },
    };

    function createVorschlagHinzugefuegtEvent(v: Vorschlag): VorschlagHinzugefuegtEvent {
        return createEvent('VorschlagHinzugefuegt', getVorschlagsDaten(v));
    }

    function createVorschlagEingereichtEvent(v: Vorschlag): VorschlagEingereichtEvent {
        return createEvent('VorschlagEingereicht', getVorschlagsDaten(v));
    }

    function getVorschlagsDaten(v: Vorschlag): VorschlagsDaten {
        return {
            id: v.id,
            businessVorteil: v.businessVorteil,
            einreicherId: v.einreicherId,
            moeglicherUmsetzungsAufwand: v.moeglicherUmsetzungsAufwand,
            moeglicherZeitrahmen: v.moeglicherZeitrahmen,
            nichtUmsKonsequenzen: v.nichtUmsKonsequenzen,
            titel: v.titel,
            zustand: v.zustand,
        };
    }
}
