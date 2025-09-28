import type { Branded, SingleError } from '@vorschlagswesen/modellierung';
import { singleError } from '@vorschlagswesen/modellierung';
import type { BenutzerId } from '@vorschlagswesen/dl-benutzer';
import { VorschlagsZustand, type Aufwand, type ZeitRahmen } from './VorschlagTypes.js';
import { Ok, Err, type Result } from 'ts-results-es';

export type VorschlagId = Branded<string, 'VorschlagId'>;

export type FalscherVorschlagsZustand = SingleError<'falscher-vorschlags-zustand'>;

export type VorschlagData = {
    id: VorschlagId;
    einreicherId: BenutzerId;
    zustand: VorschlagsZustand;
    titel: string;
    businessVorteil: string;
    moeglicherUmsetzungsAufwand: Aufwand;
    moeglicherZeitrahmen: ZeitRahmen;
    nichtUmsKonsequenzen: string;
};

export type VorschlagTimestamps = {
    createdAt: Date | string; // Date or ISO string for the Date
    updatedAt: Date | string; // Date or ISO string for the Date
};

type VorschlagMethods = {
    reicheEin(): Result<void, FalscherVorschlagsZustand>;
    genehmige(): Result<void, FalscherVorschlagsZustand>;
    lehneAb(grund: string): Result<void, FalscherVorschlagsZustand>;
    verschiebe(neuerZeitrahmen: ZeitRahmen): Result<void, FalscherVorschlagsZustand>;
    archiviere(): Result<void, FalscherVorschlagsZustand>;
};

// @Entity
// @AggregateRoot
export type Vorschlag = VorschlagData & VorschlagTimestamps & VorschlagMethods;

// @Factory
export const createVorschlag = (
    data: VorschlagData,
    timestamps?: VorschlagTimestamps,
): Vorschlag => ({
    ...data,
    createdAt: timestamps ? new Date(timestamps.createdAt) : new Date(),
    updatedAt: timestamps ? new Date(timestamps.updatedAt) : new Date(),

    reicheEin(): Result<void, FalscherVorschlagsZustand> {
        if (this.zustand !== VorschlagsZustand.NEU) {
            return Err(
                singleError(
                    'falscher-vorschlags-zustand',
                    `Vorschlag kann nur im Zustand NEU eingereicht werden, aktueller Zustand: ${this.zustand}`,
                ),
            );
        }
        this.zustand = VorschlagsZustand.EINGEREICHT;
        this.updatedAt = new Date();
        return Ok.EMPTY;
    },

    genehmige(): Result<void, FalscherVorschlagsZustand> {
        if (this.zustand !== VorschlagsZustand.EINGEREICHT) {
            return Err(
                singleError(
                    'falscher-vorschlags-zustand',
                    `Vorschlag kann nur im Zustand EINGEREICHT genehmigt werden, aktueller Zustand: ${this.zustand}`,
                ),
            );
        }
        this.zustand = VorschlagsZustand.GENEHMIGT;
        this.updatedAt = new Date();
        return Ok.EMPTY;
    },

    lehneAb(_grund: string): Result<void, FalscherVorschlagsZustand> {
        if (this.zustand !== VorschlagsZustand.EINGEREICHT) {
            return Err(
                singleError(
                    'falscher-vorschlags-zustand',
                    `Vorschlag kann nur im Zustand EINGEREICHT abgelehnt werden, aktueller Zustand: ${this.zustand}`,
                ),
            );
        }
        this.zustand = VorschlagsZustand.ABGELEHNT;
        this.updatedAt = new Date();
        // TODO: Ablehnungsgrund speichern
        return Ok.EMPTY;
    },

    verschiebe(neuerZeitrahmen: ZeitRahmen): Result<void, FalscherVorschlagsZustand> {
        if (
            this.zustand !== VorschlagsZustand.EINGEREICHT &&
            this.zustand !== VorschlagsZustand.GENEHMIGT
        ) {
            return Err(
                singleError(
                    'falscher-vorschlags-zustand',
                    `Vorschlag kann nur im Zustand EINGEREICHT oder GENEHMIGT verschoben werden, aktueller Zustand: ${this.zustand}`,
                ),
            );
        }
        this.moeglicherZeitrahmen = neuerZeitrahmen;
        this.updatedAt = new Date();
        return Ok.EMPTY;
    },

    archiviere(): Result<void, FalscherVorschlagsZustand> {
        if (this.zustand === VorschlagsZustand.ARCHIVIERT) {
            return Err(
                singleError('falscher-vorschlags-zustand', `Vorschlag ist bereits archiviert`),
            );
        }
        this.zustand = VorschlagsZustand.ARCHIVIERT;
        this.updatedAt = new Date();
        return Ok.EMPTY;
    },
});
