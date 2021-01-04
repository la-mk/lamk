const Bluebird = require("bluebird");
const sdk = require("@la-mk/la-sdk");
const config = require("../migrate-mongo-config");
const MongoClient = require("mongodb").MongoClient;

const prepareSdk = async () => {
  sdk.setupSdk({
    transport: "rest",
    apiEndpoint: "https://api.lamk.dev",
  });
};

const importToSearch = async (products) => {
  await prepareSdk();

  if (products.length <= 0) {
    return Promise.resolve([]);
  }

  // We do a request with a single item first (so the collection is initialized, after which we add all the remaining items).
  await sdk.sdk
    .request("search")
    .create({ model: "products", item: products[0] });

  return Bluebird.map(
    products.slice(1),
    async (product) => {
      console.log("Adding product: ", product.name);
      return await sdk.sdk
        .request("search")
        .create({ model: "products", item: product });
    },
    { concurrency: 50 }
  );
};

const main = async () => {
  const client = await MongoClient.connect(
    config.mongodb.url,
    config.mongodb.options
  );
  const dbclient = client.db(config.mongodb.databaseName);
  // Since we don't have that much data now, we can just keep all of data in memory and import to the search engine at once.
  // Once there is more data, use the `.stream()` API to stream the results.
  const buffer = [];
  await dbclient
    .collection("products")
    .find()
    .forEach((product) => {
      buffer.push(product);
    });

  return importToSearch(buffer);
};

main().then(console.log).catch(console.error);
