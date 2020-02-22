import * as fs from 'fs';
import * as yaml from 'yaml';
import { MongoMemoryServer } from 'mongodb-memory-server';
// import setup from './src/server/server';

const getEnvvars = async () => {
  const serviceName = 'data-api';
  const dc = await (
    await fs.promises.readFile('../../docker-compose.yaml')
  ).toString();
  const asYaml = yaml.parse(dc);
  return asYaml.services[serviceName].environment;
};

const setEnvvarsToProcess = (envvars: { [key: string]: string | number }) => {
  Object.entries(envvars).forEach(([key, val]) => {
    process.env[key] = val.toString();
  });

  // By default it runs on port 80, for tests run on a different port.
  process.env.PORT = '4050';
};

// const serverListeningPromise = (server: any) => {
//   return new Promise(resolve => {
//     server.once('listening', resolve());
//   });
// };

// This setup is used for integration tests, as we cannot access global. outside of setup and teardown.
module.exports = async () => {
  const envvars = await getEnvvars();
  const mongod = new MongoMemoryServer();
  envvars.MONGODB_CONNECTION_STRING = await mongod.getConnectionString(
    envvars.MONGODB_DB_NAME,
  );
  setEnvvarsToProcess(envvars);

  // const app = await setup();
  // const server = app.listen(process.env.PORT);
  // await serverListeningPromise(server);

  global.__MONGOD__ = mongod;
  // global.feathersApp = app;
  // global.server = server;
};
