// @ts-check

import _ from 'lodash';
import fastify from 'fastify';
import i18next from 'i18next';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData } from './helpers/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
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
  });

  beforeEach(async () => {
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it('edit, not authenticated', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: '5' }),
    });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
  });

  it('edit', async () => {
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: testData.users.existing,
      },
    });
    expect(responseSignIn.statusCode).toBe(302);
    expect(responseSignIn.headers.location).toBe('/');

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };
    const responseEdit = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: '2' }),
      cookies: cookie,
    });
    expect(responseEdit.statusCode).toBe(200);
    const header = i18next.t('views.users.edit.header');
    expect(responseEdit.payload).toMatch(new RegExp(`<h1.*>${header}<.*h1>`));

    const responseEdit2 = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id: '5' }),
      cookies: cookie,
    });
    expect(responseEdit2.statusCode).toBe(302);
    expect(responseEdit2.headers.location).toBe('/users');
  });

  it('patch', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchUser', { id: '2' }),
      payload: {
        data: testData.users.third,
      },
    });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/users');

    const emptyEmail = testData.users.forth;
    const response2 = await app.inject({
      method: 'PATCH',
      url: app.reverse('patchUser', { id: '2' }),
      payload: { data: emptyEmail },
    });
    expect(response2.statusCode).toBe(200);
  });

  it('delete, not authenticated', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: '5' }),
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/');
  });

  it('delete, not authorised', async () => {
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: testData.users.new,
      },
    });
    expect(responseSignIn.statusCode).toBe(302);
    expect(responseSignIn.headers.location).toBe('/');

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    const responseDel = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: '9' }),
      cookies: cookie,
    });
    expect(responseDel.statusCode).toBe(302);
    expect(responseDel.headers.location).toBe('/users');
  });

  it('delete, authorised', async () => {
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: testData.users.new,
      },
    });
    expect(responseSignIn.statusCode).toBe(302);
    expect(responseSignIn.headers.location).toBe('/');

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    const responseDel = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: '4' }),
      cookies: cookie,
    });
    expect(responseDel.statusCode).toBe(302);
    expect(responseDel.headers.location).toBe('/users');
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
