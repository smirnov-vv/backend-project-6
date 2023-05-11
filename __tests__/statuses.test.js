// @ts-check

import fastify from 'fastify';
import i18next from 'i18next';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test routes CRUD', () => {
  let app;
  let knex;
  let models;
  let cookie;
  const testData = getTestData();

  const makePost = (route, data, cookies) => {
    app.inject({
      method: 'POST',
      url: app.reverse(route),
      cookies,
      payload: {
        data,
      },
    });
  };

  const makePatch = (route, id, data) => app.inject({
    method: 'PATCH',
    url: app.reverse(route, { id }),
    cookies: cookie,
    payload: { data },
  });

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    // TODO: пока один раз перед тестами
    // тесты не должны зависеть друг от друга
    // перед каждым тестом выполняем миграции
    // и заполняем БД тестовыми данными
    await knex.migrate.latest();
    await prepareData(app);

    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: testData.users.existing,
      },
    });

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    cookie = { [name]: value };

    await makePost('statuses', testData.statuses.first, cookie);
    await makePost('tags', testData.tags.first, cookie);
    await makePost('tasks', testData.tasks.first, cookie);
  });

  beforeEach(async () => {
  });

  it.each([
    ['statuses', 'views.statuses.header'],
    ['tags', 'views.marks.header'],
    ['tasks', 'views.tasks.header'],
    ['users', 'views.users.header'],
    ['newStatus', 'views.statuses.new.create'],
    ['newTag', 'views.marks.new.create'],
    ['newTask', 'views.tasks.new.create'],
    ['newUser', 'views.users.new.create'],
  ])('get: %s', async (route, viewPath) => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse(route),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
    const header = i18next.t(viewPath);
    expect(response.payload).toMatch(new RegExp(`<h1.*>${header}<.*h1>`));
  });

  it.each([
    ['editStatus', 'views.statuses.edit.header'],
    ['editTag', 'views.marks.edit.header'],
    ['editTask', 'views.tasks.edit.header'],
  ])('edit: %s', async (route, viewPath) => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse(route, { id: '1' }),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
    const header = i18next.t(viewPath);
    expect(response.payload).toMatch(new RegExp(`<h1.*>${header}<.*h1>`));
  });

  it.each([
    ['statuses', testData.statuses.second],
    ['labels', testData.tags.second],
    ['tasks', testData.tasks.second],
  ])('create: %s', async (route, params) => {
    const response = await app.inject({
      method: 'POST',
      url: app.reverse(route),
      cookies: cookie,
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(`/${route}`);
    const expected = params;
    const result = {
      statuses: await models.status.query().findOne({ name: params.name }),
      labels: await models.tag.query().findOne({ name: params.name }),
      tasks: await models.task.query().findOne({ name: params.name }),
    };
    expect(result[route]).toMatchObject(expected);
  });

  it.each([
    ['patchStatus', testData.statuses.third, testData.statuses.forth],
    ['patchTag', testData.tags.third, testData.tags.forth],
    ['patchTask', testData.tasks.third, testData.tasks.forth],
  ])('patch: %s', async (route, data, emptyName) => {
    const id = 1;

    const response = await makePatch(route, 1, data);
    expect(response.statusCode).toBe(302);

    const expectedLocation = {
      patchStatus: '/statuses',
      patchTag: '/labels',
      patchTask: '/tasks',
    };
    expect(response.headers.location).toBe(expectedLocation[route]);

    const result = {
      patchStatus: await models.status.query().findById(id),
      patchTag: await models.tag.query().findById(id),
      patchTask: await models.task.query().findById(id),
    };
    expect(result[route]).toMatchObject(data);

    const response2 = await makePatch(route, 1, emptyName);
    expect(response2.statusCode).toBe(200);
  });

  it.each([
    ['deleteStatus'],
    ['deleteTag'],
    ['deleteTask'],
  ])('delete: %s', async (route) => {
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse(route, { id: 1 }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);

    const expectedLocation = {
      deleteStatus: '/statuses',
      deleteTag: '/labels',
      deleteTask: '/tasks',
    };
    expect(response.headers.location).toBe(expectedLocation[route]);
  });

  it('view: task', async () => {
    const params = testData.tasks.second;
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('lookAtTask', { id: '2' }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
    expect(response.payload).toMatch(new RegExp(`<h1.*>${params.name}<.*h1>`));
  });

  afterEach(async () => {
    // Пока Segmentation fault: 11
    // после каждого теста откатываем миграции
    // await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
