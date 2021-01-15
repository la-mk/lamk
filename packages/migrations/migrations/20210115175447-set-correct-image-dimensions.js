const Bluebird = require("bluebird");
const probe = require("probe-image-size");

const getImageInfo = async (storeId, imageId) => {
  const url = `https://artifacts.la.mk/${storeId}/${imageId}`;
  try {
    return await probe(url);
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

module.exports = {
  async up(db) {
    const products = await db.collection("products").find({}).toArray();
    await Bluebird.map(
      products,
      async (product) => {
        if (!product.media || !product.media.length) {
          return;
        }

        const media = await Bluebird.all(
          (product.media || []).map(async (image) => {
            console.log(`Getting new dimensions for ${image._id}...`);
            const newInfo = await getImageInfo(product.soldBy, image._id);
            if (!newInfo) {
              console.log(`Didn't find anything for ${image._id}`);
              return image;
            }
            console.log(`New dimensions: ${newInfo.height}, ${newInfo.width}`);

            return {
              _id: image._id,
              size: newInfo.length,
              height: newInfo.height,
              width: newInfo.width,
              mimeType: newInfo.mime,
            };
          })
        );

        console.log(`Updating product: ${product.name}`);
        return db
          .collection("products")
          .updateMany({ _id: product._id }, { $set: { media } });
      },
      { concurrency: 10 }
    );

    const stores = await db.collection("stores").find({}).toArray();
    await Bluebird.map(
      stores,
      async (store) => {
        if (!store.logo) {
          return;
        }

        console.log(`Getting new dimensions for ${store.logo._id}...`);
        const newInfo = await getImageInfo(store._id, store.logo._id);
        if (!newInfo) {
          console.log(`Didn't find anything for ${store.logo._id}`);
          return;
        }
        console.log(`New dimensions: ${newInfo.height}, ${newInfo.width}`);

        console.log(`Updating store: ${store.slug}`);
        const logo = {
          _id: store.logo._id,
          size: newInfo.length,
          height: newInfo.height,
          width: newInfo.width,
          mimeType: newInfo.mime,
        };

        return db
          .collection("stores")
          .updateMany({ _id: store._id }, { $set: { logo } });
      },
      { concurrency: 10 }
    );

    const storeContents = await db
      .collection("storeContents")
      .find({})
      .toArray();
    await Bluebird.map(
      storeContents,
      async (storeContent) => {
        if (!storeContent.landing || !storeContent.landing.banner) {
          return;
        }

        console.log(
          `Getting new dimensions for ${storeContent.landing.banner._id}...`
        );
        const newInfo = await getImageInfo(
          storeContents.forStore,
          storeContent.landing.banner._id
        );
        if (!newInfo) {
          console.log(
            `Didn't find anything for ${storeContent.landing.banner._id}`
          );
          return;
        }

        console.log(`New dimensions: ${newInfo.height}, ${newInfo.width}`);

        const banner = {
          _id: storeContent.landing.banner._id,
          size: newInfo.length,
          height: newInfo.height,
          width: newInfo.width,
          mimeType: newInfo.mime,
        };

        console.log(`Updating store content: ${storeContent._id}`);
        return db
          .collection("storeContents")
          .updateMany(
            { _id: storeContent._id },
            { $set: { "landing.banner": banner } }
          );
      },
      { concurrency: 10 }
    );

    const orders = await db.collection("orders").find({}).toArray();
    await Bluebird.map(
      orders,
      async (order) => {
        const ordered = await Bluebird.all(
          order.ordered.map(async (x) => {
            const media = await Bluebird.all(
              (x.product.media || []).map(async (image) => {
                console.log(`Getting new dimensions for ${image._id}...`);
                const newInfo = await getImageInfo(x.product.soldBy, image._id);
                if (!newInfo) {
                  console.log(`Didn't find anything for ${image._id}`);
                  return image;
                }
                console.log(
                  `New dimensions: ${newInfo.height}, ${newInfo.width}`
                );

                return {
                  _id: image._id,
                  size: newInfo.length,
                  height: newInfo.height,
                  width: newInfo.width,
                  mimeType: newInfo.mime,
                };
              })
            );

            return {
              ...x,
              product: {
                ...x.product,
                media,
              },
            };
          })
        );

        console.log(`Updating order: ${order._id}`);
        return db
          .collection("orders")
          .updateMany({ _id: order._id }, { $set: { ordered: ordered } });
      },
      { concurrency: 10 }
    );
  },

  async down(db, client) {
    // Just revert from the DB snapshot
  },
};
