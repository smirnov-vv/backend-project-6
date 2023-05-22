// @ts-check

import * as routes from './routes.js';

export default (app) => {
  app.get('/labels', { name: 'tags', preValidation: app.authenticate }, (req, reply) => routes.get(req, reply, app, 'labels'));
  app.get('/labels/new', { name: 'newTag', preValidation: app.authenticate }, (req, reply) => routes.getNew(req, reply, app, 'labels'));
  app.get('/labels/:id/edit', { name: 'editTag', preValidation: app.authenticate }, (req, reply) => routes.edit(req, reply, app, 'labels'));
  app.patch('/labels/:id', { name: 'patchTag', preValidation: app.authenticate }, (req, reply) => routes.patch(req, reply, app, 'labels'));
  app.delete('/labels/:id', { name: 'deleteTag', preValidation: app.authenticate }, (req, reply) => routes.del(req, reply, app, 'labels', 'taskTag', 'tagId'));
  app.post('/labels', { name: 'labels', preValidation: app.authenticate }, (req, reply) => routes.post(req, reply, app, 'labels'));
};
