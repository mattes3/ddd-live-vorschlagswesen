import { BenutzerId } from '@vorschlagswesen/dl-benutzer'
import { Aufwand, ZeitRahmen } from './Vorschlag.js';

// @ValueObject
export type FuegeVorschlagHinzuCommand = {
    aktuellerBenutzer: BenutzerId;
    titel: string;
    businessVorteil: string;
    moeglicherUmsetzungsAufwand: Aufwand;
    moeglicherZeitrahmen: ZeitRahmen;
    nichtUmsKonsequenzen: string;
}
