import type { Knex } from 'knex';

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'postgresql',
        connection: {
            database: 'vorschlagdb',
            host: 'localhost',
            port: 6543,
            user: 'vorschlag',
            password: 'vorschlagpasswort',
            ssl: false,
        },
        migrations: {
            directory: 'knex/migrations',
            tableName: 'knex_migrations',
        },
    },
};

export default config;
