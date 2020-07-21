const Bluebird = require('bluebird');

module.exports = {
  async up(db, client) {
    const products = await db.collection('products').find({}).toArray();
    await Bluebird.map(products, product => {
      const newModel = {
        soldBy: product.soldBy,
        name: product.name,
        unit: product.unit,
        category: product.category,
        groups: product.groups,
        images: product.images,
        description: product.description,
        variants: [
          {
            price: product.price,
            calculatedPrice: product.calculatedPrice,
            discount: product.discount,
            sku: product.sku,
            stock: product.stock,
          }
        ],

        totalStock: product.stock,
        minPrice: product.price,
        maxPrice: product.price,
        minDiscount: product.discount,
        maxDiscount: product.discount,
        minCalculatedPrice: product.calculatedPrice,
        maxCalculatedPrice: product.calculatedPrice,
        createdAt: product.createdAt,
        modifiedAt: product.modifiedAt,
      }

      return db.collection('products').replaceOne({_id: product._id}, newModel);
    }, { concurrency: 30 });
  },

  async down(db, client) {
    // If the up part fails, it means something went wrong and we can't gracefully down, so it's useless to write it.
  }
};
