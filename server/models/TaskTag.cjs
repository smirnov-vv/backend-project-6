// @ts-check

const BaseModel = require('./BaseModel.cjs');
const objectionUnique = require('objection-unique');
const encrypt = require('../lib/secure.cjs');
// const Task = require('./Task.cjs');

const unique = objectionUnique({ fields: ['id'] });

module.exports = class TaskTag extends unique(BaseModel) {
  static get tableName() {
    return 'tasks_tags';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['taskId', 'tagId'],
      properties: {
        id: { type: 'integer' },
        taskId: { type: 'integer' },
        tagId: { type: 'integer' },
      },
    };
  }
}