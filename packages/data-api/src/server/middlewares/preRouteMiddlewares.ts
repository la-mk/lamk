import { Application, original as express } from '@feathersjs/express';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';

export const initPreRouteMiddlewares = async (app: Application) => {
  //TODO: Handle all of these by a reverse proxy.
  app.use(helmet());
  app.use(cors());
  app.use(compress());

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
};
