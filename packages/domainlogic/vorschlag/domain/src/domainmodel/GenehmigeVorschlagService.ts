import { AsyncResult } from 'ts-results-es';

import { beginWith, type TechError } from '@vorschlagswesen/modellierung';

import {
    createGenehmigeVorschlagServiceError,
    type GenehmigeVorschlagServiceError,
} from './GenehmigeVorschlagServiceErrors.js';
import { type GenehmigeVorschlagServiceParams } from './GenehmigeVorschlagServiceParams.js';
import { type FalscherVorschlagsZustand } from './Vorschlag.js';
import { type VorschlagRepository } from './VorschlagRepository.js';

type TransactionOnVorschlagRepository = <T, E>(
    work: (repo: VorschlagRepository) => AsyncResult<T, E>,
) => AsyncResult<T, E | TechError>;

export type GenehmigeVorschlagService = (
    params: GenehmigeVorschlagServiceParams,
) => AsyncResult<void, TechError | FalscherVorschlagsZustand | GenehmigeVorschlagServiceError>;

// @DomainService
export const GenehmigeVorschlagServiceImpl =
    (transact: TransactionOnVorschlagRepository): GenehmigeVorschlagService =>
    (parameterObject) => {
        return beginWith(parameterObject).andThen((params) =>
            transact((repo) =>
                repo
                    .get({ id: params.vorschlagId })
                    .andThen((option) =>
                        option.toResult(
                            createGenehmigeVorschlagServiceError(
                                'Vorschlag with id ' + params.vorschlagId + ' not found',
                            ),
                        ),
                    )
                    .andThen((vorschlag) => vorschlag.genehmige().map(() => vorschlag))
                    .andThen((vorschlag) =>
                        repo.update({
                            id: params.vorschlagId,
                            updates: { zustand: vorschlag.zustand },
                        }),
                    ),
            ),
        );
    };
