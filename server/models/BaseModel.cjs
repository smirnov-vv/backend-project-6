// @ts-check

const { Model } = require('objection');

module.exports = class BaseModel extends Model {
  $beforeUpdate() {
    // this.updated_at = knex.fn.now();
    this.updated_at = new Date().toISOString();
  }
  static get modelPaths() {
    return [__dirname];
  }
}
