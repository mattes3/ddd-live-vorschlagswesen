import { Knex } from 'knex';
import { Model, Transaction } from 'objection';
import { AsyncResult, Err, None, Ok, Some } from 'ts-results-es';

import { getLogger } from '@logtape/logtape';
import { techError } from '@vorschlagswesen/modellierung';

// Using .js extensions for ESM compliance with TypeScript's nodenext moduleResolution
import {
    createVorschlag,
    VorschlagData,
    VorschlagTimestamps,
} from '../../domainmodel/Vorschlag.js';
import { VorschlagRepository } from '../../domainmodel/VorschlagRepository.js';

import { VorschlagModel } from './VorschlagModel.js';

type TransactionOnRepoProvider<RepositoryType> = <T, E>(
    work: (trx: RepositoryType) => AsyncResult<T, E>,
) => AsyncResult<T, E>;

const withTransactionFor =
    <R>(createRepository: (trx: Transaction) => R): TransactionOnRepoProvider<R> =>
    (work) =>
        new AsyncResult(Model.transaction((trx) => work(createRepository(trx)).promise));

export const VorschlagRepositoryImpl = (
    knex: Knex,
): TransactionOnRepoProvider<VorschlagRepository> => {
    // Initialize knex for Objection models
    VorschlagModel.knex(knex);

    const logger = getLogger(['vorschlagswesen', 'VorschlagRepository']);

    const dataOf = ({
        createdAt,
        updatedAt,
        moeglicherZeitrahmenVon,
        moeglicherZeitrahmenBis,
        ...rest
    }: VorschlagModel): VorschlagData => ({
        ...rest,
        moeglicherZeitrahmen: { von: moeglicherZeitrahmenVon, bis: moeglicherZeitrahmenBis },
    });

    const timestampsOf = ({ createdAt, updatedAt }: VorschlagModel): VorschlagTimestamps => ({
        createdAt,
        updatedAt,
    });

    return withTransactionFor<VorschlagRepository>((trx) => ({
        findVorschlaegeByZustand({ zustand }) {
            return new AsyncResult(
                VorschlagModel.query(trx)
                    .where('zustand', zustand)
                    .then((results) =>
                        Ok(
                            results.map((result) =>
                                createVorschlag(dataOf(result), timestampsOf(result)),
                            ),
                        ),
                    )
                    .catch((error: Error) => {
                        const method = 'VorschlagRepository.findVorschlaegeByZustand()';
                        logger.error(`{ method } failed:\n { error }`, {
                            method,
                            error,
                            zustand,
                        });
                        return Err(
                            techError(`${method} failed for zustand ${zustand}: ${error.message}`),
                        );
                    }),
            );
        },

        add({ item }) {
            const { moeglicherZeitrahmen, ...rest } = item;

            return new AsyncResult(
                VorschlagModel.query(trx)
                    .insert({
                        moeglicherZeitrahmenVon: moeglicherZeitrahmen.von,
                        moeglicherZeitrahmenBis: moeglicherZeitrahmen.bis,
                        ...rest,
                    } as const)
                    .then(() => Ok(undefined))
                    .catch((error: Error) => {
                        const method = 'VorschlagRepository.add()';
                        logger.error(`{ method } failed:\n { error }`, {
                            method,
                            error,
                            item,
                        });
                        return Err(
                            techError(`${method} failed for ID ${item.id}: ${error.message}`),
                        );
                    }),
            );
        },

        get({ id }) {
            return new AsyncResult(
                VorschlagModel.query(trx)
                    .findById(id)
                    .then((result) =>
                        Ok(
                            result
                                ? Some(createVorschlag(dataOf(result), timestampsOf(result)))
                                : None,
                        ),
                    )
                    .catch((error: Error) => {
                        const method = 'VorschlagRepository.get()';
                        logger.error(`{ method } failed:\n { error }`, {
                            method,
                            error,
                            id,
                        });
                        return Err(techError(`${method} failed for ID ${id}: ${error.message}`));
                    }),
            );
        },

        update({ id, updates }) {
            return new AsyncResult(
                VorschlagModel.query(trx)
                    .patchAndFetchById(id, updates)
                    .then(() => Ok(undefined))
                    .catch((error: Error) => {
                        const method = 'VorschlagRepository.update()';
                        logger.error(`{ method } failed:\n { error }`, {
                            method,
                            error,
                            id,
                            updates,
                        });
                        return Err(techError(`${method} failed for ID ${id}: ${error.message}`));
                    }),
            );
        },

        remove({ item }) {
            return new AsyncResult(
                VorschlagModel.query(trx)
                    .deleteById(item.id)
                    .then(() => Ok(undefined))
                    .catch((error: Error) => {
                        const method = 'VorschlagRepository.remove()';
                        logger.error(`{ method } failed:\n { error }`, {
                            method,
                            error,
                            id: item.id,
                        });
                        return Err(
                            techError(`${method} failed for ID ${item.id}: ${error.message}`),
                        );
                    }),
            );
        },
    }));
};
