import * as got from 'got';
import * as url from 'url';
import env from '../../common/env';
import setup from '../server';
import { Server } from 'http';
import { Application } from '@feathersjs/express';
import { MongoClient } from 'mongodb';

const port = env.SERVER_PORT || 3030;
const getUrl = (pathname?: string) =>
  url.format({
    hostname: env.SERVER_HOST || 'localhost',
    protocol: 'http',
    port,
    pathname,
  });

describe('Server', () => {
  let server: Server;
  let feathersApp: Application;

  beforeAll(done => {
    setup().then(app => {
      feathersApp = app;
      server = app.listen(port);
      server.once('listening', () => done());
    });
  });

  afterAll(async done => {
    await (feathersApp.get('mongoClient') as MongoClient).close();
    server.close(done);
  });

  it('starts and pings the server', async () => {
    expect.assertions(1);
    const res: got.Response<any> = await got(getUrl('stores'), { json: true });
    expect(res.body.total).toBe(0);
  });
});
