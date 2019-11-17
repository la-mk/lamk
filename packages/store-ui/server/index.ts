import express from 'express';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';
import { NextI18NextInstance } from '../src/common/i18n';

const port = process.env.VIRTUAL_PORT || 8080;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

(async () => {
  await app.prepare();
  const server = express();

  server.use(nextI18NextMiddleware(NextI18NextInstance));

  server.get('*', (req: any, res: any) => handle(req, res));

  await server.listen(port);
  console.log(`> Ready on store.${process.env.HOST}${port}`); // eslint-disable-line no-console
})();
