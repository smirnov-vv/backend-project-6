// @ts-check

export const up = (knex) => (
  knex.schema.createTable('tasks_tags', (table) => {
    table.increments('id').primary();
    table
      .integer('task_id')
      .unsigned()
      .index()
      .notNullable();
    table
      .foreign('task_id')
      .references('id')
      .inTable('tasks')
      .onDelete('RESTRICT');
    table
      .integer('tag_id')
      .unsigned()
      .index()
      .notNullable();
    table
      .foreign('tag_id')
      .references('id')
      .inTable('tags')
      .onDelete('RESTRICT');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
);

export const down = (knex) => knex.schema.dropTable('tasks_tags');
