import { Knex } from 'knex';

import { standardDates } from './utils/standardDates.js';
import { createUpdateTrigger, dropUpdateTrigger } from './utils/standardUpdateTriggers.js';

const TABLE_NAME = 'vorschlaege';

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable(`vorschlagswesen.${TABLE_NAME}`, (table) => {
            table.string('id', 26).primary({ constraintName: `${TABLE_NAME}_pkey` });
            standardDates(knex, table);

            table.string('einreicher_id', 26).notNullable();
            table.string('zustand', 20).notNullable();

            table.text('titel').notNullable();
            table.text('business_vorteil').notNullable();
            table.text('nicht_ums_konsequenzen').notNullable();

            table.integer('moeglicher_umsetzungs_aufwand').notNullable();
            table.timestamp('moeglicher_zeitrahmen_von', { useTz: true }).notNullable();
            table.timestamp('moeglicher_zeitrahmen_bis', { useTz: true }).notNullable();
        })
        .raw(createUpdateTrigger(TABLE_NAME));
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .raw(dropUpdateTrigger(TABLE_NAME))
        .dropTable(`vorschlagswesen.${TABLE_NAME}`);
}
