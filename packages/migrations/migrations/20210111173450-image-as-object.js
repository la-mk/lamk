const Bluebird = require("bluebird");

module.exports = {
  async up(db) {
    const products = await db.collection("products").find({}).toArray();
    await Bluebird.map(
      products,
      (product) => {
        const media = (product.images || []).map((image) => ({
          _id: image,
          height: 1000,
          width: 1000,
          size: 100,
          mimeType: "image/png",
        }));

        console.log(`Updating product: ${product.name}`);
        return db
          .collection("products")
          .updateMany(
            { _id: product._id },
            { $set: { media }, $unset: { images: "" } }
          );
      },
      { concurrency: 30 }
    );

    const stores = await db.collection("stores").find({}).toArray();
    await Bluebird.map(
      stores,
      (store) => {
        if (!store.logo) {
          return;
        }

        console.log(`Updating store: ${store.slug}`);
        const logo = {
          _id: store.logo,
          height: 1000,
          width: 1000,
          size: 100,
          mimeType: "image/png",
        };

        return db
          .collection("stores")
          .updateMany({ _id: store._id }, { $set: { logo } });
      },
      { concurrency: 30 }
    );

    const storeContents = await db
      .collection("storeContents")
      .find({})
      .toArray();
    await Bluebird.map(
      storeContents,
      (storeContent) => {
        if (!storeContent.landing || !storeContent.landing.banner) {
          return;
        }

        const banner = {
          _id: storeContent.landing.banner,
          height: 1000,
          width: 1000,
          size: 100,
          mimeType: "image/png",
        };

        console.log(`Updating store content: ${storeContent._id}`);
        return db
          .collection("storeContents")
          .updateMany(
            { _id: storeContent._id },
            { $set: { "landing.banner": banner } }
          );
      },
      { concurrency: 30 }
    );

    const orders = await db.collection("orders").find({}).toArray();
    await Bluebird.map(
      orders,
      (order) => {
        const ordered = order.ordered.map((x) => {
          const media = (x.product.images || []).map((image) => ({
            _id: image,
            height: 1000,
            width: 1000,
            size: 100,
            mimeType: "image/png",
          }));

          const res = {
            ...x,
            product: {
              ...x.product,
              media,
            },
          };

          delete res.product.images;
          return res;
        });

        console.log(`Updating order: ${order._id}`);
        return db
          .collection("orders")
          .updateMany({ _id: order._id }, { $set: { ordered: ordered } });
      },
      { concurrency: 30 }
    );
  },

  async down(db, client) {
    // Just revert from the DB snapshot
  },
};
