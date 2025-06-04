import { logger } from '@vorschlagswesen/logger';
import { TechError, techError } from '@vorschlagswesen/modellierung';
import { Err, Ok, Result } from 'ts-results-es';
import { ulid } from 'ulid';

import { FuegeVorschlagHinzuCommand } from './FuegeVorschlagHinzuCommand.js';
import { ReicheVorschlagEinCommand } from './ReicheVorschlagEinCommand.js';
import { Vorschlag, VorschlagsId, VorschlagsZustand } from './Vorschlag.js';
import { VorschlagRepository } from './VorschlagRepository.js';
import { VorschlagService } from './VorschlagService.js';

export class VorschlagServiceImpl implements VorschlagService {
    constructor(
        private transact: <T>(
            repoCallback: (repo: VorschlagRepository) => Promise<T>,
        ) => Promise<T>,
    ) {}

    async fuegeVorschlagHinzu(
        command: FuegeVorschlagHinzuCommand,
    ): Promise<Result<void, TechError>> {
        const v = new Vorschlag({
            id: ulid() as VorschlagsId,
            einreicherId: command.aktuellerBenutzer,
            zustand: VorschlagsZustand.NEU,
            titel: command.titel,
            businessVorteil: command.businessVorteil,
            moeglicherUmsetzungsAufwand: command.moeglicherUmsetzungsAufwand,
            moeglicherZeitrahmen: command.moeglicherZeitrahmen,
            nichtUmsKonsequenzen: command.nichtUmsKonsequenzen,
        });

        // TODO: Events aus `ergebnis` verschicken!
        v.fuegeHinzu();
        return this.transact(async (repo) => repo.add(v))
            .then(() => Ok(undefined))
            .catch((e) => {
                logger.error(e);
                return Err(techError('Technischer Fehler beim Speichern des Vorschlags'));
            });
    }

    async reicheVorschlagEin(
        _command: ReicheVorschlagEinCommand,
    ): Promise<Result<void, TechError>> {
        return Err(techError('Methode noch nicht implementiert'));
    }
}
