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
    .get('/labels', { name: 'tags', preValidation: app.authenticate }, async (req, reply) => {
      const tags = await app.objection.models.tag.query();
      reply.render('labels/index', { tags });
      return reply;
    })
    .get('/labels/new', { name: 'newTag', preValidation: app.authenticate }, (req, reply) => {
      const tag = new app.objection.models.tag();
      reply.render('labels/new', { tag });
    })
    .get('/labels/:id/edit', { name: 'editTag', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const tag = await app.objection.models.tag.query().findById(id);
      reply.render('labels/edit', { tag });
      return reply;
    })
    .patch('/labels/:id', { name: 'patchTag', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const tag = await app.objection.models.tag.query().findById(id);
      try {
        const newData = { ...req.body.data, updatedAt: updatedAt() };
        await tag.$query().patch(newData);
        req.flash('info', i18next.t('flash.tags.edit.info'));
        reply.redirect(app.reverse('tags'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tags.edit.error'));
        reply.render('labels/edit', { tag, errors: data });
      }
      return reply;
    })
    .delete('/labels/:id', { name: 'deleteTag', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const isThereTask = await app.objection.models.taskTag.query().findOne({ tagId: id });
      if (!isThereTask) {
        await app.objection.models.tag.query().deleteById(id);
        req.flash('info', i18next.t('flash.tags.delete.info'));
        reply.redirect(app.reverse('tags'));
      } else {
        req.flash('error', i18next.t('flash.tags.delete.error'));
        reply.redirect(app.reverse('tags'));
      }
      return reply;
    })
    .post('/labels', { preValidation: app.authenticate }, async (req, reply) => {
      const tag = new app.objection.models.tag();
      tag.$set(req.body.data);

      try {
        const validTag = await app.objection.models.tag.fromJson(req.body.data);
        await app.objection.models.tag.query().insert(validTag);
        req.flash('info', i18next.t('flash.tags.create.success'));
        reply.redirect(app.reverse('tags'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.tags.create.error'));
        reply.render('labels/new', { tag, errors: data });
      }

      return reply;
    });
};
