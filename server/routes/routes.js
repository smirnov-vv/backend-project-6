// @ts-check

import i18next from 'i18next';

const query = {
  statuses: (app) => app.objection.models.status.query(),
  labels: (app) => app.objection.models.tag.query(),
  users: (app) => app.objection.models.user.query(),
  task: (app) => app.objection.models.task.query(),
  taskTag: (app) => app.objection.models.taskTag.query(),
};

const newInstance = {
  statuses: (app) => new app.objection.models.status(),
  labels: (app) => new app.objection.models.tag(),
  users: (app) => new app.objection.models.user(),
};

const model = {
  statuses: (app) => app.objection.models.status,
  labels: (app) => app.objection.models.tag,
  users: (app) => app.objection.models.user,
};

export const get = async (req, reply, app, route) => {
  reply.render(`${route}/index`, { [route]: await query[route](app) });
  return reply;
};

export const getNew = (req, reply, app, route) => reply.render(`${route}/new`, { entity: newInstance[route](app) });

export const edit = async (req, reply, app, route) => {
  const { id } = req.params;
  reply.render(`${route}/edit`, { entity: await query[route](app).findById(id) });
  return reply;
};

export const patch = async (req, reply, app, route) => {
  const { id } = req.params;
  const entity = await query[route](app).findById(id);
  try {
    await entity.$query().patch(req.body.data);
    req.flash('info', i18next.t(`flash.${route}.edit.info`));
    reply.redirect(app.reverse(route));
  } catch (e) {
    req.flash('error', i18next.t(`flash.${route}.edit.error`));
    reply.render(`${route}/edit`, { entity, errors: e.data });
  }
  return reply;
};

export const del = async (req, reply, app, route, task, elId) => {
  const { id } = req.params;
  const isThereTask = await query[task](app).findOne({ [elId]: id });
  if (!isThereTask) {
    await query[route](app).deleteById(id);
    req.flash('info', i18next.t(`flash.${route}.delete.info`));
    reply.redirect(app.reverse(route));
  } else {
    req.flash('error', i18next.t(`flash.${route}.delete.error`));
    reply.redirect(app.reverse(route));
  }
  return reply;
};

export const post = async (req, reply, app, route) => {
  const entity = newInstance[route](app);
  entity.$set(req.body.data);
  try {
    const validData = await model[route](app).fromJson(req.body.data);
    await query[route](app).insert(validData);
    req.flash('info', i18next.t(`flash.${route}.create.success`));
    reply.redirect(app.reverse(route));
  } catch ({ data }) {
    req.flash('error', i18next.t(`flash.${route}.create.error`));
    reply.render(`${route}/new`, { entity, errors: data });
  }
  return reply;
};
