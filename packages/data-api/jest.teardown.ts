export default async function() {
  global.__MONGOD__.stop();
  // await global.feathersApp.get('mongoClient').close();
  // await global.server.close();
  return;
}
