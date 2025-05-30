import Knex from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';

export async function initKnexAndObjection() {
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

    try {
        const start1 = Date.now();

        // Initialize knex.
        await knex.raw('SELECT 1');
        console.log('Initialized Knex: ', Date.now() - start1);
    } catch (e: unknown) {
        console.error('Error initializing Knex', JSON.stringify(e, undefined, 2));
        return;
    }

    // Give the knex instance to objection.
    Model.knex(knex);
}
