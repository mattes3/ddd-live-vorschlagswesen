import { Err, Ok, Result } from 'ts-results-es';
import { FuegeVorschlagHinzuCommand } from './FuegeVorschlagHinzuCommand.js';
import { VorschlagService } from './VorschlagService.js';
import { ReicheVorschlagEinCommand } from './ReicheVorschlagEinCommand.js';
import { VorschlagRepository } from './VorschlagRepository.js';
import { ulid } from 'ulid';
import { Vorschlag, VorschlagsId, VorschlagsZustand } from './Vorschlag.js';

export class VorschlagServiceImpl implements VorschlagService {
    constructor(
        private transact: <T>(
            repoCallback: (repo: VorschlagRepository) => Promise<T>,
        ) => Promise<T>,
    ) {}

    async fuegeVorschlagHinzu(command: FuegeVorschlagHinzuCommand): Promise<Result<void, Error>> {
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

        return this.transact(async (repo) => {
            const ergebnis = v.fuegeHinzu();
            repo.add(v);
            return ergebnis;
        })
            .then(() => Ok(undefined))
            .catch((e) => Err(e));
    }

    async reicheVorschlagEin(_command: ReicheVorschlagEinCommand): Promise<Result<void, Error>> {
        return Err(new Error('Methode noch nicht implementiert'));
    }
}
