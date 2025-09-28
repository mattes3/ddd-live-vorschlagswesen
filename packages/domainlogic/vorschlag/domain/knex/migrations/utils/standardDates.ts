import type { Knex } from 'knex';

export function standardDates(knex: Knex, table: Knex.CreateTableBuilder) {
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true });
}
