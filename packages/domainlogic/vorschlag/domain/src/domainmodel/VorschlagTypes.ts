import type { Branded } from '@vorschlagswesen/modellierung';

export enum VorschlagsZustand {
    NEU = 'NEU',
    EINGEREICHT = 'EINGEREICHT',
    GENEHMIGT = 'GENEHMIGT',
    ABGELEHNT = 'ABGELEHNT',
    ARCHIVIERT = 'ARCHIVIERT',
}

export type Aufwand = Branded<number, 'Personentage'>;

export type ZeitRahmen = {
    von: Date;
    bis: Date;
};
