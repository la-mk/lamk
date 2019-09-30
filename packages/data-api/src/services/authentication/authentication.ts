import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth } from '@feathersjs/authentication-oauth';
import { Application } from '@feathersjs/feathers';
import env from '../../common/env';

export const authentication = (app: Application) => {
  app.set('authentication', {
    secret: env.JWT_SECRET,
    entity: 'user',
    service: 'users',
    authStrategies: ['jwt', 'local'],
    jwtOptions: {
      header: { typ: 'access' },
      audience: 'https://la.mk',
      issuer: 'lamk',
      algorithm: 'HS256',
      expiresIn: '10d',
    },
    local: {
      usernameField: 'email',
      passwordField: 'password',
    },
    oauth: {
      redirect: '/',
      facebook: {
        key: '<facebook oauth key>',
        secret: '<facebook oauth secret>',
      },
    },
  });

  const authentication = new AuthenticationService(app);
  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
