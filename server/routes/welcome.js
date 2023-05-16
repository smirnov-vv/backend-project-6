// @ts-check
import i18next from 'i18next';

export default (app) => {
  app
    .get('/', { name: 'root' }, (req, reply) => {
      reply.render('welcome/index');
    })
    .get('/change', (req, reply) => {
      i18next.changeLanguage(req.query.lang);
      reply.redirect(req.headers.referer);
    })
    .get('/protected', { name: 'protected', preValidation: app.authenticate }, (req, reply) => {
      reply.render('welcome/index');
    });
};
