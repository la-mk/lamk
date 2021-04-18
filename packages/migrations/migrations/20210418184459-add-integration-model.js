const { v4: uuid } = require("uuid");

module.exports = {
  async up(db, client) {
    const stores = await db.collection("stores").find({}).toArray();
    await Promise.all(
      stores.map((store) => {
        return db.collection("storeIntegrations").insertOne({
          _id: uuid(),
          forStore: store._id,
          services: {},
          createdAt: new Date(Date.now()).toISOString(),
        });
      })
    );
  },

  async down(db, client) {
    await db.collection("storeIntegrations").drop();
  },
};
