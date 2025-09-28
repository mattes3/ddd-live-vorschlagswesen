import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .raw('CREATE extension IF NOT EXISTS "uuid-ossp" SCHEMA public')
        .raw('CREATE extension IF NOT EXISTS "pgcrypto"  SCHEMA public')
        .createSchema('vorschlagswesen');
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropSchema('vorschlagswesen')
        .raw('DROP extension "uuid-ossp"')
        .raw('DROP extension "pgcrypto"');
}
