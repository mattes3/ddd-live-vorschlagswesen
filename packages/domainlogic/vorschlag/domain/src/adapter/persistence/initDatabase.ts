import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import { AsyncResult, Err, Ok } from 'ts-results-es';
import { getLogger } from '@logtape/logtape';
import { beginWith, techError, TechError } from '@vorschlagswesen/modellierung';

export function initKnexAndObjection(): AsyncResult<Knex.Knex, TechError> {
    const logger = getLogger(['vorschlagswesen', 'vorschlag', 'db']);
    const knex = Knex({
        client: 'postgresql',
        connection: {
            database: 'vorschlagdb',
            host: 'localhost',
            port: 6543,
            user: 'vorschlag',
            password: 'vorschlagpasswort',
            ssl: false,
        },
        pool: {
            min: 0,
            max: 10,
        },
        ...knexSnakeCaseMappers(),
    });

    return beginWith(knex).andThen((knex) => {
        const start1 = Date.now();

        return knex
            .raw('SELECT 1')
            .then(() => {
                console.log('Initialized Knex: ', Date.now() - start1);
                return Ok(knex);
            })
            .catch((error) => {
                const method = 'initKnexAndObjection()';
                logger.error(`{ method } failed:\n { error }`, {
                    method,
                    error,
                });

                return Err(
                    techError('Error initializing Knex' + JSON.stringify(error, undefined, 2)),
                );
            });
    });
}
