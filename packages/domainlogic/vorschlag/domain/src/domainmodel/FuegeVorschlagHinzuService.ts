import { AsyncResult } from 'ts-results-es';

import { beginWith, type TechError } from '@vorschlagswesen/modellierung';

// Using .js extensions for ESM compliance with TypeScript's nodenext moduleResolution
import { randomUUID } from 'node:crypto';
import { type FuegeVorschlagHinzuServiceError } from './FuegeVorschlagHinzuServiceErrors.js';
import { type FuegeVorschlagHinzuServiceParams } from './FuegeVorschlagHinzuServiceParams.js';
import { type VorschlagData, type VorschlagId } from './Vorschlag.js';
import { type VorschlagRepository } from './VorschlagRepository.js';
import { VorschlagsZustand } from './VorschlagTypes.js';

type TransactionOnVorschlagRepository = <T, E>(
    work: (repo: VorschlagRepository) => AsyncResult<T, E>,
) => AsyncResult<T, E | TechError>;

export type FuegeVorschlagHinzuService = (
    params: FuegeVorschlagHinzuServiceParams,
) => AsyncResult<VorschlagId, FuegeVorschlagHinzuServiceError>;

// @DomainService
export const FuegeVorschlagHinzuServiceImpl =
    (transact: TransactionOnVorschlagRepository): FuegeVorschlagHinzuService =>
    (parameterObject) => {
        return beginWith(parameterObject).andThen((params) =>
            transact((repo) => {
                const vorschlagId = randomUUID() as VorschlagId;

                const vorschlagData: VorschlagData = {
                    id: vorschlagId,
                    einreicherId: params.einreicherId,
                    zustand: VorschlagsZustand.NEU,
                    titel: params.titel,
                    businessVorteil: params.businessVorteil,
                    moeglicherUmsetzungsAufwand: params.moeglicherUmsetzungsAufwand,
                    moeglicherZeitrahmen: params.moeglicherZeitrahmen,
                    nichtUmsKonsequenzen: params.nichtUmsKonsequenzen,
                };

                return repo.add({ item: vorschlagData }).map(() => vorschlagId);
            }),
        );
    };

// This is how to wire the dependencies into the service implementation:
// const x = FuegeVorschlagHinzuServiceImpl(VorschlagRepositoryImpl(...));
