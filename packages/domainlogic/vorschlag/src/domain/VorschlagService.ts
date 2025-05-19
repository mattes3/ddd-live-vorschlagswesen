import type { Result } from 'ts-results-es';
import type { FuegeVorschlagHinzuCommand } from './FuegeVorschlagHinzuCommand.js';
import type { ReicheVorschlagEinCommand } from './ReicheVorschlagEinCommand.js';

export interface VorschlagService {
    fuegeVorschlagHinzu(command: FuegeVorschlagHinzuCommand): Promise<Result<void, Error>>;
    reicheVorschlagEin(command: ReicheVorschlagEinCommand): Promise<Result<void, Error>>;
}
