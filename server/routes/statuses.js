// @ts-check

import * as routes from './routes.js';

export default (app) => {
  app.get('/statuses', { name: 'statuses', preValidation: app.authenticate }, (req, reply) => routes.get(req, reply, app, 'statuses'));
  app.get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, (req, reply) => routes.getNew(req, reply, app, 'statuses'));
  app.get('/statuses/:id/edit', { name: 'editStatus', preValidation: app.authenticate }, (req, reply) => routes.edit(req, reply, app, 'statuses'));
  app.patch('/statuses/:id', { name: 'patchStatus', preValidation: app.authenticate }, (req, reply) => routes.patch(req, reply, app, 'statuses'));
  app.delete('/statuses/:id', { name: 'deleteStatus', preValidation: app.authenticate }, (req, reply) => routes.del(req, reply, app, 'statuses', 'task', 'statusId'));
  app.post('/statuses', { preValidation: app.authenticate }, (req, reply) => routes.post(req, reply, app, 'statuses'));
};
