// @ts-check

export const up = (knex) => (
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('description');
    table
      .integer('status_id')
      .unsigned()
      .index()
      .notNullable();
    table
      .foreign('status_id')
      .references('id')
      .inTable('statuses')
      .onDelete('RESTRICT');
    table
      .integer('creator_id')
      .unsigned()
      .index()
      .notNullable();
    table
      .foreign('creator_id')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table
      .integer('executor_id')
      .unsigned()
      .index()
      .notNullable();
    table
      .foreign('executor_id')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
);

export const down = (knex) => knex.schema.dropTable('tasks');
