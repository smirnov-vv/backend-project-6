// @ts-check

import i18next from 'i18next';

const updatedAt = () => {
  const curTime = new Date();
  const month = curTime.getMonth() + 1 < 10 ? `0${curTime.getMonth() + 1}` : `${curTime.getMonth() + 1}`;
  const day = curTime.getDate() < 10 ? `0${curTime.getDate()}` : `${curTime.getDate()}`;
  const hours = curTime.getHours() < 10 ? `0${curTime.getHours()}` : `${curTime.getHours()}`;
  const minutes = curTime.getMinutes() < 10 ? `0${curTime.getMinutes()}` : `${curTime.getMinutes()}`;
  const seconds = curTime.getSeconds() < 10 ? `0${curTime.getSeconds()}` : `${curTime.getSeconds()}`;
  return `${curTime.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default (app) => {
  app
    .get('/statuses', { name: 'statuses', preValidation: app.authenticate }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, (req, reply) => {
      const status = new app.objection.models.status();
      reply.render('statuses/new', { status });
    })
    .get('/statuses/:id/edit', { name: 'editStatus', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const status = await app.objection.models.status.query().findById(id);
      reply.render('statuses/edit', { status });
      return reply;
    })
    .patch('/statuses/:id', { name: 'patchStatus', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const status = await app.objection.models.status.query().findById(id);
      try {
        const newData = { ...req.body.data, updatedAt: updatedAt() };
        await status.$query().patch(newData);
        req.flash('info', i18next.t('flash.statuses.edit.info'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.edit.error'));
        reply.render('statuses/edit', { status, errors: data });
      }
      return reply;
    })
    .delete('/statuses/:id', { name: 'deleteStatus', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const isThereTask = await app.objection.models.task.query().findOne({ statusId: id });
      if (!isThereTask) {
        await app.objection.models.status.query().deleteById(id);
        req.flash('info', i18next.t('flash.statuses.delete.info'));
        reply.redirect(app.reverse('statuses'));
      } else {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        reply.redirect(app.reverse('statuses'));
      }
      return reply;
    })
    .post('/statuses', { preValidation: app.authenticate }, async (req, reply) => {
      const status = new app.objection.models.status();
      status.$set(req.body.data);

      try {
        const validStatus = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: data });
      }

      return reply;
    });
};
