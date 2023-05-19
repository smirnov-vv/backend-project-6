// @ts-check

import i18next from 'i18next';

import * as routes from './routes.js';

const isAuthorised = (req) => {
  const currentUser = req.session.get('userId');
  const toBeDeletedUser = Number(req.params.id);
  return currentUser === toBeDeletedUser;
};

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => routes.get(req, reply, app, 'users'))
    .get('/users/new', { name: 'newUser' }, (req, reply) => routes.getNew(req, reply, app, 'users'))
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate }, async (req, reply) => {
      if (isAuthorised(req)) {
        const { id } = req.params;
        const entity = await app.objection.models.user.query().findById(id);
        reply.render('users/edit', { entity });
        return reply;
      }
      req.flash('error', i18next.t('flash.users.edit.error'));
      reply.redirect(app.reverse('users'));
      return reply;
    })
    .patch('/users/:id', { name: 'patchUser' }, async (req, reply) => routes.patch(req, reply, app, 'users'))
    .delete('/users/:id', { name: 'deleteUser', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const isCreator = await app.objection.models.task.query().findOne({ creatorId: id });
      const isExecutor = await app.objection.models.task.query().findOne({ executorId: id });
      if (isAuthorised(req) && !isCreator && !isExecutor) {
        req.logOut();
        await app.objection.models.user.query().deleteById(id);
        req.flash('info', i18next.t('flash.users.delete.info'));
        // req.session.delete();
        reply.redirect(app.reverse('users'));
        return reply;
      }
      if (isAuthorised(req)) {
        req.flash('error', i18next.t('flash.users.delete.errorAuth'));
      } else {
        req.flash('error', i18next.t('flash.users.delete.error'));
      }
      reply.redirect(app.reverse('users'));
      return reply;
    })
    .post('/users', async (req, reply) => routes.post(req, reply, app, 'users'));
};
