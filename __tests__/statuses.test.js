// @ts-check

import fastify from 'fastify';
import i18next from 'i18next';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let cookie;
  const testData = getTestData();

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

    const params = testData.statuses.first;
    await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      cookies: cookie,
      payload: {
        data: params,
      },
    });
  });

  beforeEach(async () => {
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
    const header = i18next.t('views.statuses.header');
    expect(response.payload).toMatch(new RegExp(`<h1.*>${header}<.*h1>`));
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
    const header = i18next.t('views.statuses.new.create');
    expect(response.payload).toMatch(new RegExp(`<h1.*>${header}<.*h1>`));
  });

  it('edit', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editStatus', { id: '1' }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
    const header = i18next.t('views.statuses.edit.header');
    expect(response.payload).toMatch(new RegExp(`<h1.*>${header}<.*h1>`));
  });

  it('create', async () => {
    const params = testData.statuses.second;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      cookies: cookie,
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/statuses');
    const expected = params;
    const status = await models.status.query().findOne({ name: params.name });
    expect(status).toMatchObject(expected);
  });

  it('patch', async () => {
    const data = testData.statuses.third;
    const id = 1;
    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchStatus', { id }),
      cookies: cookie,
      payload: { data },
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/statuses');
    const status = await models.status.query().findById(id);
    expect(status).toMatchObject(data);

    const emptyName = testData.statuses.forth;
    const response2 = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchStatus', { id }),
      cookies: cookie,
      payload: { data: emptyName },
    });

    expect(response2.statusCode).toBe(200);
  });

  it('delete', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteStatus', { id: 1 }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/statuses');
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
