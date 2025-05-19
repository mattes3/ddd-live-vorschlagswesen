import { BenutzerId } from '@vorschlagswesen/dl-benutzer'
import { VorschlagsId } from './Vorschlag.js';

export type ReicheVorschlagEinCommand = {
    aktuellerBenutzer: BenutzerId;
    vorschlagsId: VorschlagsId;
}
