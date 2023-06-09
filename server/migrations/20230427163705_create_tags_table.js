// @ts-check

export const up = (knex) => (
  knex.schema.createTable('tags', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
  })
);

export const down = (knex) => knex.schema.dropTable('tags');
