// @ts-nocheck

import i18next from 'i18next';
import _ from 'lodash';

const isAuthorised = (req, task) => {
  const currentUser = req.session.get('userId');
  const taskBelongsTo = task.creatorId;
  return currentUser === taskBelongsTo;
};

const getLabelIds = (data) => {
  if (data.labels === undefined) {
    return [];
  } if (data.labels.length === 1) {
    return [data.labels];
  } if (data.labels.length > 1) {
    return data.labels;
  }
  return [];
};

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const keysOfAllParams = Object.keys(req.query);
      const notUsedParams = keysOfAllParams.filter((param) => (req.query[param] === ''));
      const usedParams = _.omit(req.query, [...notUsedParams, 'isCreatorUser', 'tagId']);
      const keysOfUsedParams = Object.keys(usedParams);
      const params = keysOfUsedParams.reduce(
        (acc, key) => ({ ...acc, [key]: Number(usedParams[key]) }),
        {},
      );
      if (req.query.isCreatorUser === 'on') {
        params.creatorId = req.session.get('userId');
      }

      const tasksWithoutLabel = await app.objection.models.task.query()
        .select(
          'tasks.id as taskId',
          'tasks.description',
          'tasks.name',
          'status.name as status',
          'creator.firstName as creatorFirstName',
          'creator.lastName as creatorLastName',
          'executor.firstName as executorFirstName',
          'executor.lastName as executorLastName',
          'tasks.createdAt',
        )
        .where(params)
        .joinRelated('[creator, executor, status]');

      const labelId = Number(req.query.tagId);
      const filter = labelId ? { tagId: labelId } : {};
      const tasksWithTheLabel = await app.objection.models.taskTag.query()
        .where(filter);
      const tasksWithTheLabelIds = tasksWithTheLabel.map((taskLabel) => taskLabel.taskId);
      const tasksWithLabel = tasksWithoutLabel
        .filter((task) => tasksWithTheLabelIds.includes(Number(task.taskId)));
      const tasks = labelId ? tasksWithLabel : tasksWithoutLabel;

      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      const labels = await app.objection.models.tag.query();
      reply.render('tasks/index', {
        tasks,
        users,
        statuses,
        labels,
        labelId,
        params,
      });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      const tags = await app.objection.models.tag.query();
      const tasksTags = await app.objection.models.taskTag.query();
      reply.render('tasks/new', {
        task,
        users,
        statuses,
        tags,
        tasksTags,
      });
      return reply;
    })
    .get('/tasks/:id', { name: 'lookAtTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().findById(id)
        .select(
          'tasks.id',
          'tasks.description',
          'tasks.name',
          'status.name as status',
          'creator.firstName as creatorFirstName',
          'creator.lastName as creatorLastName',
          'executor.firstName as executorFirstName',
          'executor.lastName as executorLastName',
          'tasks.createdAt',
        )
        .joinRelated('[creator, executor, status]');
      const tags = await app.objection.models.taskTag.query().where({ taskId: id });
      const promises = tags.map(async ({ tagId }) => {
        const tag = await app.objection.models.tag.query().findById(tagId);
        return tag.name;
      });
      const tagNames = await Promise.all(promises);
      reply.render('tasks/view', { task, tagNames });
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().findById(id);
      const users = await app.objection.models.user.query();
      const statuses = await app.objection.models.status.query();
      const tags = await app.objection.models.tag.query();
      const tasksTags = await app.objection.models.taskTag.query();
      reply.render('tasks/edit', {
        task,
        users,
        statuses,
        tags,
        tasksTags,
      });
      return reply;
    })
    .patch('/tasks/:id', { name: 'patchTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().findById(id);
      const statusId = Number(req.body.data.statusId);
      const executorId = Number(req.body.data.executorId);
      const labelIds = getLabelIds(req.body.data);
      const newData = {
        ..._.omit(req.body.data, ['labels']),
        statusId,
        executorId,
      };
      try {
        await task.$query().patch(newData);
        await app.objection.models.taskTag.query()
          .delete()
          .where('taskId', '=', id);
        labelIds.forEach(async (tagId) => {
          const data = { taskId: Number(id), tagId: Number(tagId) };
          await app.objection.models.taskTag.query().insert(data);
        });
        req.flash('info', i18next.t('flash.tasks.edit.info'));
        reply.redirect(app.reverse('tasks'));
      } catch (e) {
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.render('tasks/edit', { task, errors: e.data });
      }
      return reply;
    })
    .delete('/tasks/:id', { name: 'deleteTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const task = await app.objection.models.task.query().findById(id);
      if (isAuthorised(req, task)) {
        await app.objection.models.task.query().deleteById(id);
        await app.objection.models.taskTag.query()
          .delete()
          .where('taskId', '=', id);
        req.flash('info', i18next.t('flash.tasks.delete.info'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      }
      req.flash('error', i18next.t('flash.tasks.delete.error'));
      reply.redirect(app.reverse('tasks'));
      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      task.$set(req.body.data);
      const creatorId = req.session.get('userId');
      const statusId = Number(req.body.data.statusId);
      const executorId = Number(req.body.data.executorId);
      const labelIds = getLabelIds(req.body.data);
      const newData = {
        ..._.omit(req.body.data, ['labels']),
        creatorId,
        statusId,
        executorId,
      };

      try {
        const validTask = await app.objection.models.task.fromJson(newData);
        const newRecord = await app.objection.models.task.query().insert(validTask);
        labelIds.forEach(async (id) => {
          const data = { taskId: newRecord.id, tagId: Number(id) };
          await app.objection.models.taskTag.query().insert(data);
        });
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (e) {
        console.log(e);
        req.flash('error', i18next.t('flash.tasks.create.error'));
        const users = await app.objection.models.user.query();
        const statuses = await app.objection.models.status.query();
        const tags = await app.objection.models.tag.query();
        const tasksTags = await app.objection.models.taskTag.query();
        reply.render('tasks/new', {
          task,
          users,
          statuses,
          tags,
          tasksTags,
          errors: e.data,
        });
      }

      return reply;
    });
};
