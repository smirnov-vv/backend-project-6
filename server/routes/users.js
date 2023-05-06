// @ts-check

import i18next from 'i18next';

const isAuthorised = (req) => {
  const currentUser = req.session.get('userId');
  const toBeDeletedUser = Number(req.params.id);
  return currentUser === toBeDeletedUser;
};

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate }, async (req, reply) => {
      if (isAuthorised(req)) {
        const { id } = req.params;
        const user = await app.objection.models.user.query().findById(id);
        reply.render('users/edit', { user });
        return reply;
      }
      req.flash('error', i18next.t('flash.users.edit.error'));
      reply.redirect(app.reverse('users'));
      return reply;
    })
    .patch('/users/:id', { name: 'patchUser' }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);
      try {
        await user.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.users.edit.info'));
        reply.redirect(app.reverse('users'));
      } catch (e) {
        console.log(e);
        req.flash('error', i18next.t('flash.users.edit.failed'));
        reply.render('users/edit', { user, errors: e.data });
      }

      return reply;
    })
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
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (e) {
        console.log(e);
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: e.data });
      }

      return reply;
    });
};
